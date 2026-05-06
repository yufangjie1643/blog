---
title: '每日论文精读：面向任意畸变 8 节点砖块的虚拟单元法'
seoTitle: 'Virtual Brick VEM 精读：任意畸变 8 节点砖块、曲面面与自稳定格式'
description: '精读 CMAME 2026 论文：为什么标准 8 节点等参六面体在退化网格上失效，virtual brick 如何用曲面面 VEM 与标准 Q1 砖块兼容，并在 reaction-diffusion 问题中验证畸变鲁棒性。'
pubDate: 1777940048
sourceCheckedAt: 1777940048
slug: 'virtual-brick-vem-distorted-hexahedra'
category: '论文精读'
series: '每日论文精读'
tags: ['每日论文精读', '虚拟单元法', '有限元', '六面体网格', '数值方法']
paper:
  title: 'The virtual element method for arbitrarily distorted 8-node bricks'
  authors: ['M. Cremonesi', 'F. Dassi', 'C. Lovadina', 'U. Perego', 'A. Russo']
  venue: 'Computer Methods in Applied Mechanics and Engineering, 453, 118823'
  year: 2026
  doi: '10.1016/j.cma.2026.118823'
  url: 'https://doi.org/10.1016/j.cma.2026.118823'
  pdfUrl: '/papers/S0045782526000976-virtual-brick-vem.pdf'
  pdfFile: 'S0045782526000976-virtual-brick-vem.pdf'
---

> M. Cremonesi, F. Dassi, C. Lovadina, U. Perego, A. Russo. **The virtual element method for arbitrarily distorted 8-node bricks**. *Computer Methods in Applied Mechanics and Engineering*, 453:118823, 2026.  
> 链接：[DOI](https://doi.org/10.1016/j.cma.2026.118823) · [PDF](/papers/S0045782526000976-virtual-brick-vem.pdf)

## 文献信息与版本定位

这篇论文的真实 DOI 是 `10.1016/j.cma.2026.118823`，ScienceDirect PII 为 `S0045782526000976`。PDF 正文显示，论文题名为 *The virtual element method for arbitrarily distorted 8-node bricks*，发表在 *Computer Methods in Applied Mechanics and Engineering* 第 453 卷，文章号 118823。稿件 2025 年 12 月 19 日投稿，2026 年 2 月 6 日修回，2026 年 2 月 8 日接收，2026 年 2 月 14 日在线可用。

这篇文章确实研究 8 节点砖块单元的严重畸变问题，但它的范围比标题容易让人想象的更窄、更基础。正文中的模型问题是带反应项的简单热传导型 reaction-diffusion 方程，目标是构造并验证一个新的低阶三维虚拟单元，作者称为 **virtual brick**。它还不是用于冲压成型、大变形固体力学或多孔介质随机网格的完整工业算例；论文结论明确说，面向非线性固体力学的 virtual brick 公式正在进行中。

| 正文支持的结论 | 不宜扩写成 |
|---|---|
| 构造 8 节点、一阶、曲面面的 hexahedral VE，即 virtual brick | 已完成面向大变形固体力学的工业砖块单元替代品 |
| 与标准 `Q1` 等参砖块拥有相同节点自由度和面空间 | VEM 长期只限于四面体，本文才首次进入三维 |
| 在退化 brick 上仍可保持鲁棒，前提是各面几何不相互交叉 | 对任意自交、翻折和无效几何都无条件稳定 |
| 验证问题是 reaction-diffusion；数值测试比较畸变因子和混合 ISO-VEM | 已验证冲压、成型和复杂多物理问题 |

## 技术脉络

8 节点等参六面体是工程有限元中最常见的三维单元之一。规则网格上，它精度高、自由度效率好，通常比四面体网格用更少单元达到相近精度。但它依赖从参考立方体到物理单元的三线性映射；一旦单元严重扭曲、折叠或局部退化，Jacobian 行列式可能变小、变号甚至在单元内部消失，数值积分和梯度计算就会失去意义。

传统处理方式是修网格：改进网格质量、重划分、平滑或优化六面体网格。但复杂几何中，生成完全规则或轻微畸变的六面体网格本身就很困难，某些局部退化很难完全避免。另一条思路是不再强依赖参考单元映射，而是改变离散方法。

虚拟单元法正是在这个位置发挥作用。VEM 不显式构造单元内部形函数，而是通过自由度、投影算子和可计算的多项式一致性项来构造离散形式。这使它天然适合多边形、多面体、非凸单元和高畸变网格。问题在于，三维 conforming VEM 通常要求多面体具有平面多边形面；而工程中的 8 节点等参砖块，六个四边形面往往是双线性曲面，严重畸变时尤其如此。

本文的切入点就是把这两条线接起来：构造一个和标准 8 节点等参砖块兼容、但内部采用 VEM 思想的 **virtual brick**。

<figure class="paper-figure">
  <svg viewBox="0 0 980 360" role="img" aria-label="Virtual brick idea">
    <defs>
      <linearGradient id="brickFlow" x1="0" x2="1">
        <stop offset="0%" stop-color="#b85b2b" stop-opacity="0.92" />
        <stop offset="100%" stop-color="#1b756f" stop-opacity="0.92" />
      </linearGradient>
      <marker id="brickArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#1b756f" />
      </marker>
    </defs>
    <rect x="20" y="24" width="940" height="312" rx="14" fill="none" stroke="#9b8d7f" stroke-opacity="0.45" />
    <g font-family="Inter, Arial, sans-serif" font-size="21" fill="currentColor">
      <rect x="58" y="78" width="190" height="130" rx="8" fill="#fffaf1" stroke="#b85b2b" />
      <text x="84" y="116">标准 Q1 砖块</text>
      <text x="82" y="150" font-size="15">依赖三线性体映射</text>
      <text x="82" y="174" font-size="15">Jacobian 变号即失效</text>
      <path d="M262 143 H340" stroke="url(#brickFlow)" stroke-width="5" marker-end="url(#brickArrow)" />
      <rect x="354" y="78" width="220" height="130" rx="8" fill="#fffaf1" stroke="#1b756f" />
      <text x="394" y="116">Virtual Brick</text>
      <text x="384" y="150" font-size="15">六个双线性曲面面</text>
      <text x="384" y="174" font-size="15">内部函数保持 virtual</text>
      <path d="M588 143 H666" stroke="url(#brickFlow)" stroke-width="5" marker-end="url(#brickArrow)" />
      <rect x="680" y="78" width="220" height="130" rx="8" fill="#fffaf1" stroke="#293f67" />
      <text x="720" y="116">可混合使用</text>
      <text x="708" y="150" font-size="15">规则区用 FEM</text>
      <text x="708" y="174" font-size="15">退化区替换为 VEM</text>
      <rect x="246" y="244" width="488" height="58" rx="8" fill="#f4efe6" stroke="#9b8d7f" />
      <text x="282" y="278">同样的 8 个节点自由度，同样可用 Gauss 积分框架</text>
    </g>
  </svg>
  <figcaption>图 1. virtual brick 的工程意义不是完全抛弃六面体网格，而是在严重畸变区域用 VEM 替换标准等参砖块，同时保持节点自由度和面兼容性。</figcaption>
</figure>

## 方法机制

标准 8 节点等参砖块通过参考立方体上的 `Q1` 形函数定义三线性体映射。这个映射一旦不可逆，单元就退化。本文的 virtual brick 保留六个四边形面，并把每个面看作参考正方形的双线性映射；但它不再依赖标准砖块的三线性体映射来定义内部函数空间。换言之，面上的函数和标准 8 节点砖块兼容，体内部函数则保持 virtual。

这种设计带来三个关键后果。第一，virtual brick 与标准等参砖块共享相同的 8 个节点自由度，因此可以在同一网格中局部替换：规则单元仍用 FEM，畸变或退化单元用 VEM。第二，体积分和面积分可以继续使用标准 FEM 中常见的 Gauss 积分规则；这对未来进入非线性问题很重要，因为材料更新通常就在 Gauss 点上进行。第三，virtual brick 的几何允许严重畸变，但仍有边界：各个映射面不能彼此相交，否则单元几何本身就失去合法性。

本文还讨论了两类稳定化路线。一类是传统的 dofi-dofi 稳定化；另一类是自稳定或 stabilization-free 的 virtual brick。后者通过把虚函数梯度投影到三次调和多项式梯度空间来获得稳定性。特别地，当自稳定 virtual brick 是矩形平行六面体时，它的刚度矩阵与标准 `Q1` 等参立方体一致。这一点保证了该方法在规则网格上不会引入不必要的偏差。

<div class="paper-grid">
  <div class="paper-tile"><strong>几何对象</strong><span>六个四边形曲面面，每个面来自参考正方形的双线性映射；体内不使用标准三线性映射定义函数。</span></div>
  <div class="paper-tile"><strong>兼容性</strong><span>保持标准 8 节点砖块的自由度和面空间，可在同一网格中与普通 FEM 砖块混合。</span></div>
  <div class="paper-tile"><strong>稳定性</strong><span>给出 dofi-dofi 稳定化与自稳定版本；自稳定形式避免显式稳定项。</span></div>
</div>

## 数值实验

论文的数值实验围绕一个三维 reaction-diffusion 问题展开。扩散张量、反应项和精确解都被给定，载荷和边界值据此构造。实验目的不是展示复杂工程场景，而是干净地观察：当 brick 单元从规则逐渐变成严重畸变甚至退化时，标准等参 FEM、纯 VEM、以及 FEM-VEM 混合策略的误差和稳定性如何变化。

网格畸变通过一个参数 `d` 控制。作者从 `[0,1]^3` 的均匀立方体网格出发，把每个 `2 x 2 x 2` 小块的中心顶点随机扰动到一个由 `d` 控制的同心立方体表面附近。`d=0` 时网格规则；`d` 增大时单元逐渐扭曲，部分单元在 Gauss 点上出现 Jacobian 变号，标准等参格式会失效。

结果与直觉一致但很有工程意义：当没有退化单元时，标准等参 FEM、ISO-VEM 和 ISO-SSVEM 给出一致结果；当退化单元出现后，标准等参方法的误差已无意义或直接失败，而 virtual brick 仍能在 `L2` 和 `H1` 意义下保持稳定和收敛。更重要的是，混合策略也通过了检验：规则区域可以继续用普通 8 节点砖块，只有严重畸变区域替换成 virtual brick。

## 与相关工作的关系

VEM 的基本框架来自 Beirão da Veiga 等人的多边形/多面体虚拟单元理论。三维 VEM 在任意多面体上线弹性、大变形、热塑性、显式动力和高阶格式中都有发展，但 conforming 三维 VEM 长期受到“平面面多面体”的限制。曲边/曲面 VEM 的研究正在推进，但要直接兼容工程中已有的 8 节点等参砖块网格，仍需要一个专门的曲面面 hexahedral 元。

本文正是这个接口工作。它不把目标设为“替代所有 FEM 砖块”，而是让 VEM 成为六面体网格中的局部修复工具：当单元质量指标提示某些 brick 超出安全畸变范围时，用 virtual brick 替换这些单元，避免重划分或全局改网格。

<figure class="paper-figure">
  <svg viewBox="0 0 980 300" role="img" aria-label="Virtual brick technical lineage">
    <g font-family="Inter, Arial, sans-serif" fill="currentColor">
      <line x1="88" y1="154" x2="892" y2="154" stroke="#9b8d7f" stroke-width="3" />
      <g font-size="16">
        <circle cx="130" cy="154" r="10" fill="#b85b2b" />
        <text x="88" y="114">1990s</text>
        <text x="54" y="194">等参砖块畸变</text>
        <text x="52" y="216">Jacobian 问题</text>
        <circle cx="314" cy="154" r="10" fill="#1b756f" />
        <text x="270" y="114">2013</text>
        <text x="248" y="194">VEM 基本框架</text>
        <text x="246" y="216">多边形/多面体</text>
        <circle cx="508" cy="154" r="10" fill="#293f67" />
        <text x="456" y="114">2014-2024</text>
        <text x="428" y="194">三维 VEM</text>
        <text x="402" y="216">弹性、塑性、曲面探索</text>
        <circle cx="704" cy="154" r="10" fill="#1b756f" />
        <text x="664" y="114">2024-2025</text>
        <text x="626" y="194">自稳定 VEM</text>
        <text x="606" y="216">stabilization-free</text>
        <circle cx="862" cy="154" r="10" fill="#b85b2b" />
        <text x="822" y="114">2026</text>
        <text x="796" y="194">Virtual Brick</text>
        <text x="760" y="216">兼容 8 节点等参砖块</text>
      </g>
    </g>
  </svg>
  <figcaption>图 2. 本文位于“六面体网格质量问题”和“三维 VEM 曲面面/自稳定格式”两条路线的交点。</figcaption>
</figure>

## 局限与启发

本文的价值在于把 VEM 从“任意多面体方法”推进到“可嵌入传统 8 节点砖块网格的局部替换单元”。这对工程软件很重要，因为工业模型通常已有庞大的砖块单元库和 Gauss 点材料更新机制。如果 virtual brick 能保持自由度、面空间和积分框架兼容，未来接入非线性固体力学会少很多工程阻力。

但它目前仍是 proof-of-concept。正文验证的是 reaction-diffusion 问题，不是弹塑性、大变形接触或冲压成型；标准 Gauss 积分在退化情形中的严谨精度评估也仍被作者列为尚未完成的问题；非线性固体力学版本正在后续工作中。因此，最准确的评价是：这篇论文解决了“如何定义一个与 Q1 砖块兼容、可处理严重畸变曲面面 hexahedral 的 VEM 单元”这个底层离散问题，而不是已经完成所有工程应用验证。

## 小结

virtual brick 的思路非常务实：不要求工程师放弃六面体网格，也不要求所有单元都改成 VEM，而是在标准 8 节点砖块最脆弱的地方补上一种结构兼容的虚拟单元。它保留节点自由度和面空间，用 VEM 避开体映射不可逆带来的灾难，并通过自稳定投影与混合 FEM-VEM 策略展示了高畸变下的鲁棒性。对于未来的非线性有限元实现，这种“局部替换退化砖块”的接口价值可能比单个 reaction-diffusion 测试更重要。

## 参考资料

- Cremonesi, M., Dassi, F., Lovadina, C., Perego, U., Russo, A. [The virtual element method for arbitrarily distorted 8-node bricks](https://doi.org/10.1016/j.cma.2026.118823). *Computer Methods in Applied Mechanics and Engineering*, 453:118823, 2026.
- Beirão da Veiga, L., Brezzi, F., Cangiani, A., Manzini, G., Marini, L. D., Russo, A. [Basic principles of virtual element methods](https://doi.org/10.1142/S0218202512500492). *Mathematical Models and Methods in Applied Sciences*, 23:199-214, 2013.
- Gain, A. L., Talischi, C., Paulino, G. H. [On the virtual element method for three-dimensional linear elasticity problems on arbitrary polyhedral meshes](https://doi.org/10.1016/j.cma.2014.05.005). *Computer Methods in Applied Mechanics and Engineering*, 282:132-160, 2014.
- van Huyssteen, D., Reddy, B. D., Wriggers, P. [The incorporation of mesh quality in the stabilization of virtual element methods for nonlinear elasticity](https://doi.org/10.1016/j.cma.2022.114720). *Computer Methods in Applied Mechanics and Engineering*, 392:114720, 2022.
