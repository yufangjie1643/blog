---
title: '每日论文精读：晶格材料的 micropolar 均质化与尺寸效应'
seoTitle: 'Micropolar Lattice Homogenization 精读：Hill 边界、BCC 与尺寸效应'
description: '精读 AMM 2026 论文：如何用 micropolar 理论和 Hill 边界条件统一处理复杂 2D/3D 晶格的等效模量、各向异性和尺寸效应。'
pubDate: 1777977195
sourceCheckedAt: 1777977195
slug: 'micropolar-homogenization-lattice-size-effect'
category: '论文精读'
series: '每日论文精读'
tags: ['每日论文精读', '晶格材料', 'micropolar', '均质化', '尺寸效应']
paper:
  title: 'Micropolar homogenization constitutive modeling and size effect analysis of lattice materials'
  authors: ['Tingrui Chen', 'Fan Yang', 'Jingchun Zhang', 'Dong Han', 'Qingcheng Yang']
  venue: 'Applied Mathematics and Mechanics (English Edition), 47(1), 39-60'
  year: 2026
  doi: '10.1007/s10483-026-3338-9'
  url: 'https://doi.org/10.1007/s10483-026-3338-9'
  pdfUrl: '/papers/s10483-026-3338-9-micropolar-lattice-size-effect.pdf'
  pdfFile: 's10483-026-3338-9-micropolar-lattice-size-effect.pdf'
---

> Tingrui Chen, Fan Yang, Jingchun Zhang, Dong Han, Qingcheng Yang. **Micropolar homogenization constitutive modeling and size effect analysis of lattice materials**. *Applied Mathematics and Mechanics (English Edition)*, 47(1):39-60, 2026.  
> 链接：[DOI](https://doi.org/10.1007/s10483-026-3338-9) · [PDF](/papers/s10483-026-3338-9-micropolar-lattice-size-effect.pdf)

> 插图说明：本文图为自绘结构示意；原论文图片未检出明确开放复用声明，因此不直接转载。

## 文献信息与版本定位

这篇论文发表在 *Applied Mathematics and Mechanics (English Edition)* 47 卷第 1 期，页码 39-60，DOI 为 `10.1007/s10483-026-3338-9`。稿件 2025 年 7 月 10 日收到，2025 年 10 月 9 日修回。

论文研究的是**复杂晶格材料的 micropolar 均质化本构建模和尺寸效应**。与上一篇 SAFEM 论文偏向纤维复合材料的局部问题求解不同，这篇文章面向 2D/3D lattice materials，尤其关注非对称单胞、多内部节点、偏心 BCC 等经典弹性理论难以准确描述的结构。

## 为什么经典均质化不够

晶格材料的宏观性质由单胞几何决定。简单晶格可以用经典弹性等效为连续体，但复杂晶格往往存在微旋转、弯曲主导变形、手性耦合和尺度效应。经典理论只有位移自由度，不包含独立微转角，因此在非对称结构或非单中心节点连接中会丢失一部分力学信息。

micropolar 理论把材料点的平移和微旋转同时作为自由度。这样，宏观本构中不仅有经典应力-应变关系，还会出现与曲率、力偶应力相关的参数。对晶格材料来说，这正好对应梁单元转动、单胞尺寸和节点连接方式带来的非经典响应。

<figure class="paper-figure">
  <svg viewBox="0 0 980 360" role="img" aria-label="Micropolar homogenization of lattice materials">
    <defs>
      <marker id="latArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
        <path d="M0,0 L0,6 L9,3 z" fill="#1b756f" />
      </marker>
    </defs>
    <rect x="22" y="24" width="936" height="312" rx="14" fill="none" stroke="#9b8d7f" stroke-opacity="0.45" />
    <g font-family="Inter, Arial, sans-serif" fill="currentColor">
      <rect x="58" y="82" width="198" height="136" rx="8" fill="#fffaf1" stroke="#b85b2b" />
      <text x="94" y="120" font-size="21">复杂单胞</text>
      <text x="84" y="154" font-size="15">手性/多节点/偏心 BCC</text>
      <text x="84" y="178" font-size="15">梁弯曲与微旋转</text>
      <path d="M270 150 H344" stroke="#1b756f" stroke-width="5" marker-end="url(#latArrow)" />
      <rect x="358" y="70" width="226" height="160" rx="8" fill="#fffaf1" stroke="#1b756f" />
      <text x="404" y="110" font-size="21">Hill 边界</text>
      <text x="390" y="144" font-size="15">宏观应变与曲率加载</text>
      <text x="390" y="168" font-size="15">应变能等价</text>
      <text x="390" y="192" font-size="15">节点平衡方程</text>
      <path d="M598 150 H672" stroke="#1b756f" stroke-width="5" marker-end="url(#latArrow)" />
      <rect x="686" y="82" width="218" height="136" rx="8" fill="#fffaf1" stroke="#293f67" />
      <text x="728" y="120" font-size="21">等效本构</text>
      <text x="716" y="154" font-size="15">经典刚度 Aijkl</text>
      <text x="716" y="178" font-size="15">micropolar 柔度 Hijkl</text>
      <rect x="236" y="266" width="508" height="48" rx="8" fill="#f4efe6" stroke="#9b8d7f" />
      <text x="282" y="296" font-size="17">结论核心：弹性刚度可与单胞尺寸无关，micropolar 参数显示强尺寸效应</text>
    </g>
  </svg>
  <figcaption>图 1. 本文把复杂晶格单胞通过 Hill 边界条件加载，用应变能等价得到 micropolar 等效本构，从而捕捉经典弹性遗漏的尺寸效应。</figcaption>
</figure>

## 方法机制

论文先回顾 micropolar 理论：位移 `u` 和微旋转 `phi` 独立，几何方程中同时包含应变和曲率项。本构关系因此包含经典刚度项和 micropolar 相关项。

均质化部分使用 Hill 边界条件和应变能等价。作者对单胞施加宏观应变、宏观曲率等边界约束，建立内部节点和边界节点的平衡方程；通过求解这些节点方程，得到单胞在不同宏观加载下的总应变能，再反推出等效本构常数。

这套方法的关键优点是适应复杂单胞。论文不仅处理 2D simple-square、honeycomb、zigzag chiral lattice，也扩展到 3D traditional BCC 和 eccentric BCC。偏心 BCC 尤其有代表性：中心节点偏移会破坏立方对称性，使等效性质出现明显各向异性。

## 结果与尺寸效应

论文的 2D 验证算例显示，simple-square lattice 的归一化 Young 模量随相对密度近似线性增长，剪切模量近似二次增长；honeycomb lattice 是弯曲主导结构，Young 模量和剪切模量都呈二次型变化。这与经典结构力学直觉一致。

在 zigzag chiral lattice 中，倾角 `theta` 增大时，有效 Young 模量逐渐降低并趋于稳定。更重要的是，手性和非对称连接会引入经典弹性难以表达的耦合项；micropolar 本构可以把这些项显式保留下来。

3D BCC 算例进一步展示了对称性的重要性。传统 BCC 保持 cubic symmetry；偏心 BCC 中心节点位移 `Delta a` 会打破对称性，导致 elastic anisotropy。论文表明，理论预测与有限元验证在 `d/l` 从 0 到 0.8 范围内高度一致。

最值得带走的结论是尺寸效应：在所研究的 2D 和 3D 晶格中，宏观弹性刚度系数基本与单胞尺寸无关，而 micropolar compliance coefficients 对单胞尺寸表现出强依赖。这解释了为什么仅靠经典等效弹性常数无法完整描述小尺度晶格或结构尺寸变化。

## 局限与启发

本文建立的是线弹性、静态或准静态框架。它还没有覆盖塑性、超弹性、损伤、屈曲后路径或动力波传播。对实际增材制造晶格，节点圆角、缺陷、材料非线性和制造误差也会影响等效性质，不能直接由理想梁单胞完全替代。

但它给出了一个清晰方向：复杂晶格材料的“设计变量”不只是相对密度，还包括单胞对称性、节点拓扑、偏心量和尺寸本身。micropolar 均质化让这些变量进入显式本构，可以服务于 metamaterial 的目标性质设计。

## 小结

这篇论文的贡献在于把 micropolar 理论、Hill 边界条件和应变能等价组合成一套统一的晶格材料均质化工具。它同时覆盖 2D 和 3D 单胞，能解释手性结构和偏心 BCC 中的非经典耦合，并清楚展示了 micropolar 参数的尺寸效应。对于需要从单胞几何直接设计宏观性能的 lattice/metamaterial 研究，这是一条比经典弹性更有表达力的路线。

## 参考资料

- Chen, T. R., Yang, F., Zhang, J. C., Han, D., Yang, Q. C. [Micropolar homogenization constitutive modeling and size effect analysis of lattice materials](https://doi.org/10.1007/s10483-026-3338-9). *Applied Mathematics and Mechanics (English Edition)*, 47(1):39-60, 2026.
