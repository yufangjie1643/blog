---
title: '每日论文精读：基于 recovery 后验误差估计的相场断裂自适应有限元'
seoTitle: 'Phase-Field Fracture AFEM 精读：recovery 后验误差、FEALPy 与 2D/3D 裂纹自适应'
description: '精读 JCAM 2026 论文：如何用 recovery type 后验误差估计驱动相场断裂模型的网格自适应，减少经验裂纹标记规则并提升计算效率。'
pubDate: 1777999159
sourceCheckedAt: 1777999159
slug: 'adaptive-phase-field-fracture-recovery-error'
category: '论文精读'
series: '每日论文精读'
tags: ['每日论文精读', '相场断裂', '自适应有限元', '后验误差估计', 'FEALPy']
paper:
  title: 'Adaptive finite element method for phase field fracture models based on recovery error estimates'
  authors: ['Tian Tian', 'Chunyu Chen', 'Liang He', 'Huayi Wei']
  venue: 'Journal of Computational and Applied Mathematics, 472, 116732'
  year: 2026
  doi: '10.1016/j.cam.2025.116732'
  url: 'https://doi.org/10.1016/j.cam.2025.116732'
  pdfUrl: '/papers/S0377042725002468-adaptive-phase-field-fracture-recovery.pdf'
  pdfFile: 'S0377042725002468-adaptive-phase-field-fracture-recovery.pdf'
  codeUrl: 'https://github.com/weihuayi/fealpy'
---

> Tian Tian, Chunyu Chen, Liang He, Huayi Wei. **Adaptive finite element method for phase field fracture models based on recovery error estimates**. *Journal of Computational and Applied Mathematics*, 472:116732, 2026.  
> 链接：[DOI](https://doi.org/10.1016/j.cam.2025.116732) · [PDF](/papers/S0377042725002468-adaptive-phase-field-fracture-recovery.pdf) · [FEALPy](https://github.com/weihuayi/fealpy)

> 插图说明：本文插图为自绘结构示意。PDF 版权页显示 Elsevier 保留权利，因此不直接转载原论文图。

## 文献信息与问题定位

这篇论文发表在 *Journal of Computational and Applied Mathematics* 472 卷，文章号 116732。稿件 2024 年 10 月 2 日投稿，2025 年 4 月 20 日修回，2025 年 5 月 28 日在线可用。论文研究的是相场断裂模型中的自适应有限元方法。

相场断裂的优点是把裂纹表示成连续损伤变量，避免显式追踪裂尖和裂纹拓扑。但这也带来一个数值代价：裂纹带宽由长度尺度参数控制，裂纹附近网格必须足够细。若全域使用细网格，二维问题已经昂贵，三维问题会迅速失控。

已有 AFEM 工作常用相场梯度、应力应变变化或经验阈值来标记细化区域。本文的思路是用 **recovery type posterior error estimates** 直接从数值相场解的梯度误差出发，驱动网格细化。

<figure class="paper-figure">
  <svg viewBox="0 0 980 330" role="img" aria-label="Recovery based AFEM for phase field fracture">
    <defs>
      <marker id="afemArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
        <path d="M0,0 L0,6 L9,3 z" fill="#1b756f" />
      </marker>
    </defs>
    <rect x="24" y="24" width="932" height="282" rx="12" fill="none" stroke="#9b8d7f" stroke-opacity="0.45" />
    <g font-family="Inter, Arial, sans-serif" fill="currentColor">
      <rect x="62" y="86" width="198" height="124" rx="8" fill="#fffaf1" stroke="#b85b2b" />
      <text x="94" y="122" font-size="20">相场解 d_h</text>
      <text x="88" y="154" font-size="15">裂纹由连续变量表示</text>
      <text x="88" y="178" font-size="15">梯度局部变化剧烈</text>
      <path d="M276 148 H344" stroke="#1b756f" stroke-width="5" marker-end="url(#afemArrow)" />
      <rect x="360" y="74" width="248" height="148" rx="8" fill="#fffaf1" stroke="#1b756f" />
      <text x="408" y="112" font-size="20">梯度 recovery</text>
      <text x="392" y="144" font-size="15">把分片常数梯度平滑</text>
      <text x="392" y="168" font-size="15">比较 R_h d_h 与 ∇d_h</text>
      <text x="392" y="192" font-size="15">得到单元误差 η_τ</text>
      <path d="M624 148 H692" stroke="#1b756f" stroke-width="5" marker-end="url(#afemArrow)" />
      <rect x="708" y="86" width="210" height="124" rx="8" fill="#fffaf1" stroke="#293f67" />
      <text x="746" y="122" font-size="20">自适应细化</text>
      <text x="736" y="154" font-size="15">裂尖和裂纹路径加密</text>
      <text x="736" y="178" font-size="15">远场保持粗网格</text>
    </g>
  </svg>
  <figcaption>图 1. recovery 型后验误差估计把相场梯度从低阶空间恢复到更平滑空间，再用恢复梯度与原数值梯度的差异标记需要细化的单元。</figcaption>
</figure>

## 方法机制

论文使用 hybrid phase-field fracture formulation，通过 staggered strategy 交替求解位移和相场变量。每个加载步中，先解位移 `u_h`，更新历史函数 `H`，再解相场变量 `d_h`。随后基于 `d_h` 计算后验误差并进行网格自适应。

recovery 后验误差的核心是梯度恢复。有限元相场解的梯度在单元上通常是分片常数或低阶近似；作者用简单平均、面积加权平均、调和面积平均、角度平均、距离平均等 recovery 方式，把梯度恢复到更平滑的分片连续空间。对每个单元 `τ`，误差指标写成恢复梯度与原始数值梯度的差：

```text
η_τ = || R_h d_h - ∇d_h ||_{0,τ}
```

若恢复算子具有超收敛性质，这类估计在理论上可达到渐近准确。细化标记使用最大准则或 `L2` 准则。需要注意的是，论文说“不需要经验参数”主要是指不再依赖人工设计的裂纹梯度阈值或应力阈值；实际 AFEM 标记仍会涉及 `θ` 这类通用细化参数。

实现上，作者基于 FEALPy 完成模块化程序，使用 Python 科学计算生态和数组化编程，并提到无数值积分的矩阵装配以及 GPU 加速线性求解。这使文章不仅是方法描述，也带有软件实现导向。

## 数值实验

论文验证了几个经典二维和三维脆性断裂算例。

第一个是带圆形夹杂或圆孔的方板拉伸。自适应计算从初始网格尺寸 `h=0.05` 出发，单元数从 640 增加到 9558，总耗时 86 s。若不用自适应，为满足 `h < l0/2`，需要从 `h=0.01` 的细网格开始，单元数保持 19224，耗时 695 s。两者的相场变量、裂纹状态和残余力曲线高度一致。

第二和第三个是单边缺口板的 I 型拉伸和 II 型剪切。拉伸算例从 2048 个初始单元开始，裂纹发展时细化到 3406、6040、7510 个单元；如果不自适应，论文指出单元数不应少于 45000。剪切算例中，单元数随加载从 2048 增至 3786、5540、6226、7098，细化区域基本提前沿裂纹传播方向展开。

第四个是 L 形板的拉-压混合加载，用于检查压缩条件下裂纹不可逆性。单元数从 3750 增至 6563、22549、31265，最终到 34419。作者强调，裂纹形成后不会在压缩阶段闭合，符合相场断裂的不可逆历史变量设定。

第五个是三维带平面切口模型。初始四面体网格 38400 个单元，随裂纹演化增加到 52352、64328、82289。三维残余力曲线和对应二维计算趋势一致，细化区域沿裂纹发展方向扩展。

<div class="paper-grid">
  <div class="paper-tile"><strong>圆孔方板</strong><span>自适应 9558 单元、86 s；非自适应 19224 单元、695 s，结果保持一致。</span></div>
  <div class="paper-tile"><strong>缺口拉伸/剪切</strong><span>网格自动集中到裂尖和裂纹路径，元素数远少于全域细网格。</span></div>
  <div class="paper-tile"><strong>3D 算例</strong><span>四面体网格从 38400 细化到 82289，展示方法可进入三维相场断裂。</span></div>
</div>

## 贡献与边界

这篇文章的主要贡献是把相场断裂里的网格细化依据，从经验裂纹指标推进到 recovery 型后验误差估计。它让细化更接近数值误差控制，而不是单纯“哪里相场变量变化大就加密”。这对复杂裂纹路径尤其重要，因为裂纹即将发展的区域往往需要提前被加密。

它的边界也需要说清楚。首先，文中验证的是经典脆性断裂基准算例，还没有覆盖塑性断裂、疲劳、热断裂、多物理耦合或真实工程结构。其次，标记策略仍有通用 AFEM 参数，不能理解成完全无参数。第三，GPU 加速和无积分装配是实现亮点，但论文没有把性能分析展开到很系统的硬件对比。

另一个值得注意的点是数据声明。论文的 Data availability 写的是已在文章中引用代码链接；参考文献列出的是 FEALPy 仓库。因此，复现路径更接近“基于 FEALPy 实现相同算法”，而不是一个独立冻结的论文 artifact。

## 小结

这篇论文的价值在于把相场断裂的自适应网格控制做得更数值分析化。裂纹附近细网格是相场断裂不可避免的成本，但不必把成本扩散到整个计算域。通过恢复型后验误差估计，算法把细化集中到相场梯度误差大的区域，并在二维、三维经典算例中显示了明显的效率收益。对需要用 Python/FEALPy 做断裂模拟的人，这篇文章也是一个清晰的软件实现参考。

## 参考资料

- Tian, T., Chen, C., He, L., Wei, H. [Adaptive finite element method for phase field fracture models based on recovery error estimates](https://doi.org/10.1016/j.cam.2025.116732). *Journal of Computational and Applied Mathematics*, 472:116732, 2026.
- FEALPy: [https://github.com/weihuayi/fealpy](https://github.com/weihuayi/fealpy)
