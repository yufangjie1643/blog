---
title: '每日论文精读：单 GPU 上的 giga-voxel 多孔介质 FEM 渗透率计算'
seoTitle: 'GPU FEM Permeability 精读：matrix-free MINRES、两向量求解器与 giga-voxel μCT'
description: '精读 CMAME 2025 论文：如何用 matrix-free FEM、节点级 stencil 和轻量 MINRES 变体，在单块 GPU 上估计 giga-voxel 多孔介质的绝对渗透率。'
pubDate: 1777999159
sourceCheckedAt: 1777999159
slug: 'gpu-fem-permeability-gigavoxel-porous-media'
category: '论文精读'
series: '每日论文精读'
tags: ['每日论文精读', '多孔介质', '渗透率', 'GPU', '有限元']
paper:
  title: 'Enabling FEM-based absolute permeability estimation in giga-voxel porous media with a single GPU'
  authors: ['Pedro Cortez Fetter Lopes', 'Federico Semeraro', 'André Maués Brabo Pereira', 'Ricardo Leiderman']
  venue: 'Computer Methods in Applied Mechanics and Engineering, 434, 117559'
  year: 2025
  doi: '10.1016/j.cma.2024.117559'
  url: 'https://doi.org/10.1016/j.cma.2024.117559'
  pdfUrl: '/papers/S0045782524008132-gpu-fem-permeability-gigavoxel.pdf'
  pdfFile: 'S0045782524008132-gpu-fem-permeability-gigavoxel.pdf'
  codeUrl: 'https://github.com/cortezpedro/chfem/tree/dev/examples'
---

> Pedro Cortez Fetter Lopes, Federico Semeraro, André Maués Brabo Pereira, Ricardo Leiderman. **Enabling FEM-based absolute permeability estimation in giga-voxel porous media with a single GPU**. *Computer Methods in Applied Mechanics and Engineering*, 434:117559, 2025.  
> 链接：[DOI](https://doi.org/10.1016/j.cma.2024.117559) · [PDF](/papers/S0045782524008132-gpu-fem-permeability-gigavoxel.pdf) · [代码示例](https://github.com/cortezpedro/chfem/tree/dev/examples)

> 插图说明：本文插图为自绘结构示意。PDF 版权页显示 Elsevier 保留权利，因此不直接转载原论文图。

## 文献信息与问题定位

这篇论文发表于 *Computer Methods in Applied Mechanics and Engineering* 434 卷，文章号 117559。稿件 2024 年 8 月 13 日收到，2024 年 10 月 19 日修回，2024 年 11 月 11 日接收。论文讨论的是从 μCT 三维图像估计多孔介质绝对渗透率时，如何把 FEM Stokes 流计算推进到 giga-voxel 尺度。

多孔介质的数字岩心或纤维预制体图像通常是三维体素数据。若直接在 pore space 上求解 Stokes 方程，未知量会随图像边长三次增长。许多工作把注意力放在加速求解器上，但这篇论文强调另一个更硬的瓶颈：**显存**。即使 global matrix 不存，Krylov 求解器里的多个长度为 `n` 的向量也会成为限制。

作者的目标很明确：在单块 GPU，尤其是 8 GB、12 GB 这类消费级显卡上，尽可能扩大 FEM 渗透率计算的可处理图像规模。

<figure class="paper-figure">
  <svg viewBox="0 0 980 340" role="img" aria-label="GPU FEM permeability workflow">
    <defs>
      <marker id="gpuPermArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
        <path d="M0,0 L0,6 L9,3 z" fill="#1b756f" />
      </marker>
    </defs>
    <rect x="24" y="24" width="932" height="292" rx="12" fill="none" stroke="#9b8d7f" stroke-opacity="0.45" />
    <g font-family="Inter, Arial, sans-serif" fill="currentColor">
      <rect x="56" y="82" width="190" height="132" rx="8" fill="#fffaf1" stroke="#b85b2b" />
      <text x="92" y="120" font-size="20">μCT 体素</text>
      <text x="82" y="154" font-size="15">pore/solid 分割</text>
      <text x="82" y="178" font-size="15">非整体孔隙网格</text>
      <path d="M262 148 H330" stroke="#1b756f" stroke-width="5" marker-end="url(#gpuPermArrow)" />
      <rect x="346" y="70" width="236" height="156" rx="8" fill="#fffaf1" stroke="#1b756f" />
      <text x="390" y="108" font-size="20">Matrix-free FEM</text>
      <text x="380" y="142" font-size="15">节点编号与 stencil</text>
      <text x="380" y="166" font-size="15">不存全局矩阵/连通表</text>
      <text x="380" y="190" font-size="15">CUDA node-by-node</text>
      <path d="M598 148 H666" stroke="#1b756f" stroke-width="5" marker-end="url(#gpuPermArrow)" />
      <rect x="682" y="82" width="222" height="132" rx="8" fill="#fffaf1" stroke="#293f67" />
      <text x="726" y="120" font-size="20">MINRES2</text>
      <text x="712" y="154" font-size="15">只保留两个 n 向量</text>
      <text x="712" y="178" font-size="15">直接累计平均速度</text>
      <rect x="248" y="258" width="484" height="44" rx="8" fill="#f4efe6" stroke="#9b8d7f" />
      <text x="292" y="286" font-size="16">目标：用单 GPU 支撑 1000³ 级图像的绝对渗透率估计</text>
    </g>
  </svg>
  <figcaption>图 1. 论文的关键不是单纯把线性代数搬到 GPU，而是把体素网格、矩阵-向量乘和 Krylov 向量存储一起压缩到显存约束内。</figcaption>
</figure>

## 方法机制

论文采用常见的渗透率均质化路线：在 μCT 图像对应的代表性单胞上求解 Stokes 流，再用 Darcy 定律从体平均速度反推渗透率张量。离散上使用 FEM，Stokes 系统是 saddle-point problem，因此选择 MINRES。

实现上的第一层优化是 voxel-based non-monolithic pore meshing。作者不把整个立方体图像当作完整网格存储，而是为孔隙节点和边界节点设计编号规则，并保存少量线性数据结构。文中总结为三类列表：体素状态映射、mesh node 映射，以及边界节点周围固体/孔隙状态。这样避免存储全局单元连通矩阵。

第二层优化是 node-by-node 和 stencil-based matrix-vector product。三维 tri-linear 单元下，每个节点只和局部邻域节点交互。作者把矩阵-向量乘写成 CUDA kernel，根据局部 stencil 现场计算，而不是读取显式稀疏矩阵。

第三层也是本文最核心的内存取舍：MINRES 求解器的向量数压缩。常规 matrix-free MINRES/PMINRES 需要保存 5 个 `n` 长向量。三向量版本 MINRES3/PMINRES3 去掉辅助向量 `s` 和 `q`，代价是每步做更多 matrix-vector product。两向量版本 MINRES2/PMINRES2 更进一步，不在 GPU 上保存解向量 `x`，而是直接累计渗透率计算所需要的体平均速度。

这一步非常问题特定。若用户需要完整速度场做可视化，不能只用两向量版本；但若目标只是渗透率张量，完整场不是必须输出，省下一个 `n` 长向量就能换来更大的图像规模。

## 实验结果

论文的实验路线分三层。

第一层是半解析验证：周期圆管 Poiseuille 流和规则球堆积。这些算例有可比较的解析或半解析渗透率表达式，用来确认 FEM 渗透率结果随分辨率收敛。球堆积算例中，轻量求解器让 RTX 2080 Super 这类 8 GB GPU 能处理更大的图像。文中报告 MINRES2/PMINRES2 支撑了约 4 亿自由度的模拟，显存分配约 8 GB；512³ 体素样本约 2.54 亿自由度耗时 1 到 1.5 小时，600³ 体素样本约 4 亿自由度耗时约 3 小时。

第二层是数字岩石 benchmark，包括 Berea、Fontainebleau、Grosmont 等 μCT 样本。作者和已有 LBM、实验或经验估计对比。这里最有意思的不是所有数值都完美吻合，而是论文认真讨论了图像裁剪、孔隙率、异质性和大孔道对渗透率的影响。例如 Grosmont 样本上下半区渗透率差异明显，说明 field of view 和代表体积本身会显著影响结果。

第三层是 1000³ 碳纤维材料样本，包括 FiberForm、carbon felt 和 Calcarb。这组计算在 80 GB A100 上完成，单个样本自由度超过 3.3 到 3.7 billion。FiberForm 88.2% 孔隙率样本给出的三个方向渗透率为 `1.108`、`1.000`、`0.577` × 10⁻¹⁰ m²，和 flow-tube 实验中面内/厚向渗透率量级非常接近。三类 1000³ 样本的计算时间大致在 1.5 到 2.5 小时。

<div class="paper-grid">
  <div class="paper-tile"><strong>显存优先</strong><span>五向量最快，三向量和两向量更省显存；两向量版本面向只需要渗透率输出的场景。</span></div>
  <div class="paper-tile"><strong>单 GPU 规模</strong><span>12 GB GPU 可处理 1024×1024×512 级别 carbonate crop，约 4.94 亿自由度。</span></div>
  <div class="paper-tile"><strong>giga-voxel 应用</strong><span>A100 80 GB 上完成 1000³ 高孔隙率碳纤维样本，超过 3.7 billion DOFs。</span></div>
</div>

## 贡献与边界

本文的贡献不是提出新的 Stokes 方程或新的渗透率定义，而是把 FEM-based permeability estimation 做成了显存可承受的单 GPU 实现。它把“不要存全局矩阵”继续推进到“能不能少存 Krylov 向量”和“能不能只存渗透率输出所必需的信息”。

局限也很明确。实现依赖 Nvidia GPU 和 CUDA，轻量求解器用更多 matrix-vector product 换显存，因此并不是绝对最快。预条件器只采用简单 Jacobi，作者也指出更强的 multigrid、Schur complement 或 block preconditioner 可以降低迭代数，但会带来额外显存开销。两向量版本是渗透率均质化专用策略，不能泛化到所有 FEM 后处理任务。

另一个必须记住的边界是图像本身。μCT 分割、裁剪范围和代表体积选择会影响渗透率，有些偏差不应简单归因于求解器。论文中 Calcarb 和 Grosmont 的讨论正说明：当材料高度非均匀时，更大的模拟规模不只是为了“更酷”，而是为了更接近有代表性的体积平均。

## 小结

这篇论文非常适合做大规模数字材料计算的工程参考。它展示了一个清晰原则：在显存受限时，算法设计不能只看 FLOPs，还要逐项审视每个 `n` 长数组是否真的必须存在。对只需要渗透率张量的任务，直接累计平均速度而不保存完整速度场，是一个很有针对性的降内存策略。它牺牲了一部分每步速度，却把单 GPU 可处理的 μCT 图像规模推到了更实用的范围。

## 参考资料

- Lopes, P. C. F., Semeraro, F., Pereira, A. M. B., Leiderman, R. [Enabling FEM-based absolute permeability estimation in giga-voxel porous media with a single GPU](https://doi.org/10.1016/j.cma.2024.117559). *Computer Methods in Applied Mechanics and Engineering*, 434:117559, 2025.
- chfem examples: [https://github.com/cortezpedro/chfem/tree/dev/examples](https://github.com/cortezpedro/chfem/tree/dev/examples)
