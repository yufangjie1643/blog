---
title: '每日论文精读：冰的乘法型有限粘弹性模型与指数更新格式'
seoTitle: '冰的有限粘弹性模型精读：乘法分解、Glen 流动律与指数更新'
description: '精读 CMAME 2026 论文：从冰架崩解前缘的 Maxwell 粘弹性，到乘法型有限变形框架、Lie 导数演化方程、指数映射更新和 Glen 应力相关黏度。'
pubDate: 1777938375
updatedDate: 1777940048
sourceCheckedAt: 1777940048
slug: 'ice-finite-viscoelastic-exponential-update'
category: '论文精读'
series: '每日论文精读'
tags: ['每日论文精读', '冰川力学', '有限变形', '粘弹性', '本构模型']
paper:
  title: 'A multiplicative finite viscoelastic model for ice using an exponential update formulation'
  authors: ['J. Schröder', 'M. Koßler', 'R. Müller', 'A. Humbert']
  venue: 'Computer Methods in Applied Mechanics and Engineering, 453, 118840'
  year: 2026
  doi: '10.1016/j.cma.2026.118840'
  url: 'https://doi.org/10.1016/j.cma.2026.118840'
  pdfUrl: '/papers/S0045782526001143-ice-finite-viscoelasticity.pdf'
  pdfFile: 'S0045782526001143-ice-finite-viscoelasticity.pdf'
---

> J. Schröder, M. Koßler, R. Müller, A. Humbert. **A multiplicative finite viscoelastic model for ice using an exponential update formulation**. *Computer Methods in Applied Mechanics and Engineering*, 453:118840, 2026.  
> 链接：[DOI](https://doi.org/10.1016/j.cma.2026.118840) · [PDF](/papers/S0045782526001143-ice-finite-viscoelasticity.pdf)

## 文献信息与版本定位

这篇论文发表在 *Computer Methods in Applied Mechanics and Engineering* 第 453 卷，文章号 118840。PDF 正文显示，稿件 2025 年 10 月 27 日接收投稿，2026 年 1 月 15 日修回，2026 年 2 月 10 日接收，2026 年 2 月 20 日在线可用；题录页使用 2026 年 5 月的卷期出版信息。文章是开放获取，采用 CC BY 许可。

本文研究的是**冰架崩解前缘附近的有限变形粘弹性本构**，而不是热-粘弹-各向异性晶体模型。核心是一个 Maxwell 型有限粘弹性模型：用乘法分解分离弹性和粘性贡献，用 Lie 导数推导粘性内部变量的演化方程，再用指数映射作时间积分，使粘性部分在离散更新中保持等体积。Glen 流动律作为进一步扩展，用来把常黏度替换为应力相关的有效黏度。

| 可由正文确认的内容 | 不应写成的内容 |
|---|---|
| 乘法分解为弹性部分和粘性部分 | 弹性、粘弹性、热膨胀三重乘法分解 |
| 指数映射更新粘性内部变量，保持 `det(F_v)=1` | 解决所有有限元体积锁定问题 |
| 数值例子为自重柱和静水压力冰架 benchmark | 单轴压缩、三点弯曲松弛、循环载荷等算例 |
| Glen 流动律带来应力相关黏度 | 单晶到多晶的各向异性滑移系统演化 |

## 技术脉络

冰川冰的经典宏观流变来自 Glen-Nye 型幂律蠕变。Glen 的实验和 Nye 的流动律把冰的应变率与偏应力联系起来，使冰盖和冰架的长期流动可以被写成连续介质问题。这个传统非常适合描述慢速蠕变和大尺度速度场，但它天然偏向粘性流动；当问题转向冰架崩解前缘的应力集中、短期载荷变化和裂隙判据时，单纯粘性模型就不够完整。

冰架崩解研究把弹性和粘性响应同时带入视野。早期崩解模型关注冰舌弯曲、裂隙位置和应力峰值；后来的工作把 Maxwell 型粘弹性模型用于冰架前缘，应力预测也因此不同于纯粘性模型。Christmann、Müller 和 Humbert 等关于非线性应变理论和冰架崩解的研究，直接构成本文的问题背景：若模拟跨越多年甚至数十年，小变形理论和加法型应变分解会逐渐失去运动学一致性。

有限粘弹性的另一条技术线来自非线性固体力学。Reese-Govindjee 型有限粘弹性、Cuitiño-Ortiz 的乘法运动学更新、以及矩阵指数在有限应变积分中的应用，提供了本文使用指数映射更新内部变量的数学基础。本文的定位，就是把这些有限变形本构积分工具嵌入冰材料 Maxwell 模型，并与 Glen 流动律兼容。

<figure class="paper-figure">
  <svg viewBox="0 0 980 360" role="img" aria-label="Finite viscoelastic ice model pipeline">
    <defs>
      <linearGradient id="icePipe" x1="0" x2="1">
        <stop offset="0%" stop-color="#1b756f" stop-opacity="0.92" />
        <stop offset="100%" stop-color="#b85b2b" stop-opacity="0.9" />
      </linearGradient>
      <marker id="iceArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#1b756f" />
      </marker>
    </defs>
    <rect x="22" y="24" width="936" height="312" rx="14" fill="none" stroke="#9b8d7f" stroke-opacity="0.45" />
    <g font-family="Inter, Arial, sans-serif" font-size="21" fill="currentColor">
      <rect x="56" y="92" width="170" height="106" rx="8" fill="#fffaf1" stroke="#1b756f" />
      <text x="86" y="130">冰架前缘</text>
      <text x="78" y="160" font-size="15">短期弹性</text>
      <text x="78" y="182" font-size="15">长期蠕变</text>
      <path d="M240 145 H314" stroke="url(#icePipe)" stroke-width="5" marker-end="url(#iceArrow)" />
      <rect x="328" y="74" width="188" height="142" rx="8" fill="#fffaf1" stroke="#b85b2b" />
      <text x="356" y="112">Maxwell</text>
      <text x="350" y="146" font-size="15">F = Fe Fv</text>
      <text x="350" y="170" font-size="15">Lie 导数演化方程</text>
      <path d="M530 145 H604" stroke="url(#icePipe)" stroke-width="5" marker-end="url(#iceArrow)" />
      <rect x="618" y="74" width="234" height="142" rx="8" fill="#fffaf1" stroke="#293f67" />
      <text x="654" y="112">指数更新</text>
      <text x="646" y="146" font-size="15">exp map 更新内部变量</text>
      <text x="646" y="170" font-size="15">保持 det(Fv)=1</text>
      <path d="M735 226 V272 H138 V208" stroke="#1b756f" stroke-width="3" stroke-dasharray="8 8" fill="none" />
      <rect x="572" y="244" width="310" height="62" rx="8" fill="#f4efe6" stroke="#b85b2b" />
      <text x="604" y="272">Glen 流动律：常黏度 -> 应力相关黏度</text>
    </g>
  </svg>
  <figcaption>图 1. 本文把冰架前缘问题、有限变形 Maxwell 模型、指数更新和 Glen 流动律接到同一个本构积分框架中。</figcaption>
</figure>

## 模型机制

本文从变形梯度的乘法分解开始：

`F = F_e F_v`

其中 `F_e` 表示可恢复的弹性变形，`F_v` 表示随时间积累的粘性内部变量。与小变形加法分解不同，乘法分解直接作用在有限变形运动学上，因此更适合描述冰架在多年尺度上逐渐累积的大位移和大变形。

自由能采用有限变形弹性常见的体积-等容分解。粘性部分的演化方程由 Lie 导数得到，用以保证客观性并把粘性流动写成内部变量更新。冰材料的关键物理约束是粘性流动近似不可压，因此需要保持

`det(F_v) = 1`

指数映射更新的价值就在这里：若指数内部的粘性流动项是无迹的，那么更新后 `F_v` 的行列式在离散时间层面仍保持为 1。相比 backward Euler 型更新，指数更新并不一定允许更大的时间步；正文数值结果反而显示，在某些自重柱算例中它需要更小时间步才能收敛。但它的结构优势是明确的：它不会在长时程推进中逐步破坏粘性等体积约束。

Glen 流动律的加入改变的是黏度，而不是更新结构。标准 Maxwell 模型中的常黏度 `eta` 被替换为依赖偏应力有效量的 `eta_Glen`。为避免低应力区域出现过大的有效黏度，正文引入上限 `eta_max`。这样，模型既能保留指数映射更新的形式，又能表达冰的非线性应力相关蠕变。

<div class="paper-grid">
  <div class="paper-tile"><strong>运动学</strong><span>有限变形乘法分解 `F = F_e F_v`，不使用热膨胀或晶体滑移的多重分解。</span></div>
  <div class="paper-tile"><strong>积分格式</strong><span>指数映射更新内部粘性变量；优势是严格保持 `det(F_v)=1`。</span></div>
  <div class="paper-tile"><strong>冰流变</strong><span>Glen 流动律把常黏度扩展为应力相关黏度，并通过上限值避免数值奇异。</span></div>
</div>

## 数值例子

正文给出的第一个边值问题是**自重柱**。这个例子用于比较指数更新和 backward Euler 更新在粘性体积保持与稳定性上的差异。模型使用三角形二次单元进行有限元离散，并测试两组常黏度。结果显示，两种更新格式在某些短期应力分布上接近；但随着时间推进，backward Euler 会出现 `det(F_v)` 偏离 1 的现象，而指数更新由于其数学结构可以保持 `det(F_v)=1`。需要注意的是，指数更新不是简单意义上的“更大时间步算法”：它有时需要更小时间步，但在保持物理约束和延长可持续模拟时间方面更可靠。

第二个边值问题是**简化 Ekström 冰架 benchmark**。几何长度为 5 km，厚度为 100 m，边界受到海水静水压力作用，重点观察冰架前缘附近的纵向应力、表面/底面位移和粘性内部变量。论文先给出常黏度算例，再引入 Glen 流动律。常黏度情形作为与已有文献的对照；Glen 情形则显示，应力相关黏度会改变高应力区的松弛速度和位移分布。正文报告的结果表明，Glen 速率因子越大，有效黏度越低，高应力区域的蠕变响应越强。

这两个例子的功能不同：自重柱主要验证算法结构，冰架 benchmark 才是面向冰架前缘应力预测的物理示范。把本文说成“验证了三点弯曲、循环载荷或复杂冰架崩解过程”并不准确；它还没有直接模拟裂纹扩展或真实崩解事件。

## 结果与局限

本文最重要的结论是，指数映射更新在有限粘弹性冰模型中能严格保持粘性部分的等体积约束。这一点对长时程模拟很关键，因为冰架前缘应力和位移的历史演化会直接影响后续崩解判据。如果内部变量更新本身逐步引入非物理体积变化，长时间结果就会被数值误差污染。

不过，正文也清楚指出了下一步边界。该模型仍然需要与断裂或损伤准则耦合，才能真正模拟崩解事件；温度耦合也尚未纳入，而 Glen 速率因子本身通常依赖温度和压力；冰架密度空间变化也会影响自重载荷。换言之，本文解决的是“给冰架崩解模拟提供一个更一致的有限粘弹性材料积分框架”，不是直接给出完整的崩解预测模型。

## 小结

这篇论文的贡献不在于提出一个复杂的多物理场冰材料模型，而在于把有限变形粘弹性中的结构保持积分思想稳健地引入冰架力学。乘法分解保证运动学一致，Lie 导数给出客观的内部变量演化，指数映射在离散时间上保持粘性等体积约束，Glen 流动律进一步把冰的非线性蠕变纳入同一更新结构。对于关注冰架前缘应力演化、长期变形和后续崩解判据的研究，这是一块偏底层但很关键的本构数值模块。

## 参考资料

- Schröder, J., Koßler, M., Müller, R., Humbert, A. [A multiplicative finite viscoelastic model for ice using an exponential update formulation](https://doi.org/10.1016/j.cma.2026.118840). *Computer Methods in Applied Mechanics and Engineering*, 453:118840, 2026.
- Christmann, J., Müller, R., Humbert, A. [On nonlinear strain theory for a viscoelastic material model and its implications for calving of ice shelves](https://doi.org/10.1017/jog.2018.107). *Journal of Glaciology*, 65(250):212-224, 2019.
- Reese, S., Govindjee, S. [A theory of finite viscoelasticity and numerical aspects](https://doi.org/10.1016/S0020-7683(97)00217-5). *International Journal of Solids and Structures*, 35:3455-3482, 1998.
- Glen, J. W. [The creep of polycrystalline ice](https://doi.org/10.1098/rspa.1955.0066). *Proceedings of the Royal Society A*, 228:519-538, 1955.
