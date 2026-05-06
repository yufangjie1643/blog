---
title: '每日论文精读：不可压缩 Navier-Stokes 方程的 DG 一致分裂方法'
seoTitle: 'DG Consistent Splitting 精读：压力 Poisson、Leray 投影与高阶 BDF'
description: '精读 CMAME 2026 论文：如何把 Liu 的一致分裂压力 Poisson 方案做成 L2-conforming DG 离散，用修正压力变量、Leray 投影和线性隐式对流项获得高阶精度与更宽 CFL 稳定范围。'
pubDate: 1777971757
sourceCheckedAt: 1777971757
slug: 'dg-consistent-splitting-navier-stokes'
category: '论文精读'
series: '每日论文精读'
tags: ['每日论文精读', 'Navier-Stokes', '不可压缩流', '间断Galerkin', '时间分裂方法']
paper:
  title: 'A discontinuous Galerkin consistent splitting method for the incompressible Navier-Stokes equations'
  authors: ['Dominik T. Still', 'Natalia Nebulishvili', 'Richard Schussnig', 'Katharina Kormann', 'Martin Kronbichler']
  venue: 'Computer Methods in Applied Mechanics and Engineering, 458, 119008'
  year: 2026
  doi: '10.1016/j.cma.2026.119008'
  arxiv: '2512.05919'
  url: 'https://doi.org/10.1016/j.cma.2026.119008'
  pdfUrl: '/papers/S0045782526002811-dg-consistent-splitting-navier-stokes.pdf'
  pdfFile: 'S0045782526002811-dg-consistent-splitting-navier-stokes.pdf'
  codeUrl: 'https://github.com/exadg/exadg'
---

> Dominik T. Still, Natalia Nebulishvili, Richard Schussnig, Katharina Kormann, Martin Kronbichler. **A discontinuous Galerkin consistent splitting method for the incompressible Navier-Stokes equations**. *Computer Methods in Applied Mechanics and Engineering*, 458:119008, 2026.  
> 链接：[DOI](https://doi.org/10.1016/j.cma.2026.119008) · [arXiv](https://arxiv.org/abs/2512.05919) · [PDF](/papers/S0045782526002811-dg-consistent-splitting-navier-stokes.pdf)

## 文献信息与版本定位

这篇论文的 ScienceDirect PII 是 `S0045782526002811`，真实 DOI 为 `10.1016/j.cma.2026.119008`。PDF 正文显示，论文发表在 *Computer Methods in Applied Mechanics and Engineering* 第 458 卷，文章号 119008；稿件 2025 年 12 月 5 日投稿，2026 年 3 月 20 日修回，2026 年 4 月 14 日接收，2026 年 4 月 27 日在线可用。arXiv 记录为 `2512.05919`，第 2 版提交于 2026 年 4 月 28 日，并已关联期刊 DOI。

本文研究的是**不可压缩 Navier-Stokes 方程的高阶 DG 时间分裂求解器**。它不是提出新的湍流模型，也不是做一个面向复杂工业几何的应用报告；核心问题更底层：能否把 Liu 2009 年的一致分裂 pressure Poisson formulation 做成 `L2`-conforming discontinuous Galerkin 离散，同时保留高阶 BDF 时间推进、开放/牵引边界上的一致压力边界条件，以及较好的质量守恒和 CFL 稳定性。

| 正文支持的结论 | 不宜扩写成 |
|---|---|
| 构造了 Liu consistent splitting 的 `L2`-conforming DG 离散 | 提出一种全新的 Navier-Stokes 方程或湍流闭合模型 |
| 每步解一个压力 Poisson 方程，再解一个速度 convection-diffusion-reaction 方程 | 完全消除所有不可压缩流求解的线性代数瓶颈 |
| 线性隐式对流项能放宽显式格式的 CFL 限制，同时避免非线性求解 | 任意大时间步都无条件准确稳定 |
| 在 Taylor-Green、圆柱绕流等经典 benchmark 中验证高阶收敛与稳定性 | 已证明复杂工业外形和高雷诺真实湍流中的通用最优性 |

## 技术脉络

不可压缩 Navier-Stokes 方程的难点来自速度和压力之间的约束结构。连续方程 `div u = 0` 使压力成为 enforcing incompressibility 的 Lagrange multiplier；若直接做混合有限元离散，通常会得到 saddle-point 线性系统，并要求速度/压力空间满足 inf-sup 条件。对于高阶 DG 和大规模三维计算，这类耦合系统的预条件设计是主要成本之一。

分裂法的动机是把压力和速度分开求。经典 projection 或 fractional-step 方法每个时间步先预测速度，再通过压力 Poisson 方程修正散度。它们很高效，但压力 Poisson 方程的边界条件并不总是自然来自原方程；人为压力边界条件可能造成 pressure boundary layers，也会限制高阶时间精度。

Liu 的 consistent splitting 思路换了一个入口：不把压力 Poisson 方程仅仅看作投影修正，而是从动量方程取散度，直接用 pressure Poisson equation 替代不可压缩约束，并从动量方程推导 Dirichlet、Neumann 或开放边界上的一致压力边界条件。本文的贡献，就是把这条路线接到高阶 DG、BDF 时间推进和 ExaDG 的矩阵/矩阵自由实现上。

<figure class="paper-figure">
  <svg viewBox="0 0 980 360" role="img" aria-label="DG consistent splitting workflow">
    <defs>
      <linearGradient id="dgSplitFlow" x1="0" x2="1">
        <stop offset="0%" stop-color="#b85b2b" stop-opacity="0.92" />
        <stop offset="100%" stop-color="#1b756f" stop-opacity="0.92" />
      </linearGradient>
      <marker id="dgSplitArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#1b756f" />
      </marker>
    </defs>
    <rect x="22" y="24" width="936" height="312" rx="14" fill="none" stroke="#9b8d7f" stroke-opacity="0.45" />
    <g font-family="Inter, Arial, sans-serif" font-size="21" fill="currentColor">
      <rect x="58" y="84" width="178" height="128" rx="8" fill="#fffaf1" stroke="#b85b2b" />
      <text x="88" y="122">不可压缩 NS</text>
      <text x="82" y="154" font-size="15">速度-压力耦合</text>
      <text x="82" y="178" font-size="15">saddle-point 系统</text>
      <path d="M250 148 H324" stroke="url(#dgSplitFlow)" stroke-width="5" marker-end="url(#dgSplitArrow)" />
      <rect x="338" y="70" width="210" height="156" rx="8" fill="#fffaf1" stroke="#1b756f" />
      <text x="374" y="108">一致分裂</text>
      <text x="366" y="140" font-size="15">压力 Poisson 方程</text>
      <text x="366" y="164" font-size="15">一致压力边界条件</text>
      <text x="366" y="188" font-size="15">修正压力变量</text>
      <path d="M562 148 H636" stroke="url(#dgSplitFlow)" stroke-width="5" marker-end="url(#dgSplitArrow)" />
      <rect x="650" y="84" width="224" height="128" rx="8" fill="#fffaf1" stroke="#293f67" />
      <text x="690" y="122">DG/BDF 求解器</text>
      <text x="682" y="154" font-size="15">SIPG + 线性隐式对流</text>
      <text x="682" y="178" font-size="15">Leray + penalty 稳定</text>
      <rect x="238" y="254" width="504" height="56" rx="8" fill="#f4efe6" stroke="#9b8d7f" />
      <text x="282" y="288">每步：压力 Poisson -> 速度 convection-diffusion-reaction</text>
    </g>
  </svg>
  <figcaption>图 1. 本文的关键不是发明新的物理模型，而是把一致 pressure Poisson splitting 做成高阶 DG 可实现格式。</figcaption>
</figure>

## 方法机制

本文从不可压缩 Navier-Stokes 方程出发：

`u_t + (u . grad)u - nu Delta u + grad p = f,   div u = 0`

一致分裂的第一步，是用压力 Poisson 方程替代 `div u = 0`。对动量方程取散度，并利用足够光滑时 `div u_t` 和粘性项的散度结构，可得到压力方程；再将动量方程投影到法向，得到 Dirichlet 边界上的压力法向导数条件；在 Neumann 或牵引边界上，则由牵引条件给出压力边界值。这个推导是本文“consistent”的来源。

时间离散采用 BDF。速度方程中的对流项不是完全显式，也不是完全非线性隐式，而是用旧时间层外推速度作为 convective velocity，形成线性隐式的 convection-diffusion-reaction 方程。这样做的折中很明确：比显式对流项允许更大时间步，又不需要每步解非线性系统。

Leray 投影用于改善质量守恒。直接做投影会额外引入一个 Poisson 问题，本文用一个**修正压力变量**把外推压力和 Leray 修正项合并起来。于是每个时间步仍然只需要一个 modified pressure Poisson equation，再解速度方程；这也是数值结果中 modified pressure 版本比直接 Leray projection 版本更实用的原因。

空间离散采用 `L2`-conforming DG。压力 Poisson 步和粘性项使用 SIPG；对流项可以写成 convective form 或 divergence form，数值通量分别采用 upwind 或 local Lax-Friedrichs。为了提高质量守恒和稳定性，速度方程中还加入 divergence penalty 和 normal-continuity penalty。二者的作用类似于把 DG 速度场往 `H(div)` 结构推近：一个抑制单元内散度，一个抑制面法向跳跃。

<div class="paper-grid">
  <div class="paper-tile"><strong>时间推进</strong><span>BDF-1 到 BDF-4；高阶情形中压力/对流外推阶数可降为 `J-1` 来换取稳定性。</span></div>
  <div class="paper-tile"><strong>压力步</strong><span>解 modified pressure PPE；边界条件由原动量方程和牵引边界一致推导。</span></div>
  <div class="paper-tile"><strong>速度步</strong><span>解线性隐式 convection-diffusion-reaction 方程，并加入散度与法向连续性 penalty。</span></div>
</div>

## 数值实验

第一组实验是二维 Taylor-Green vortex 的 manufactured solution。这个例子有解析解，用来验证空间和时间收敛阶。作者在时间收敛测试中使用 `k_u=5, k_p=4`，令空间误差足够小；结果显示 BDF-1 到 BDF-4 对速度和压力都达到预期的 `O(dt^J)` 收敛。空间收敛测试中，速度多项式次数 `k_u=2..5`、压力次数 `k_p=1..4`，速度与压力均观察到 `h^{k+1}` 级别的最优收敛。一个很重要的细节是：如果去掉 Leray projection，压力和速度的收敛阶都会明显下降；因此它不是装饰性的后处理，而是该 DG consistent splitting 格式达到高阶精度的关键部件。

第二组实验是 Schäfer-Turek 的二维圆柱绕流 2D-3 benchmark。几何是带圆柱的二维通道，最大 Reynolds 数为 100，考察最大阻力、最大升力和终止时刻压力差。本文用 `k_u=3,4,5` 的高阶速度空间，在 800 个单元、BDF-3、时间步 `1e-5` 设置下得到与文献参考值非常接近的结果。例如 `k_u=5` 时，最大阻力为 `2.95091848`，最大升力为 `0.4778877448`，压力差为 `-0.11161596715`，与 Fehn 等人的高精度参考值几乎重合。

这个圆柱算例还用来比较 CFL 稳定性。显式对流项在 CFL 变大后很快失败；线性隐式对流项在表中一直算到 CFL 16 仍能给出结果。完全隐式对流项在精度上有时更接近参考值，但代价是非线性系统。进一步与 dual splitting 方法比较时，BDF-2 在所测 CFL 范围内表现稳定；BDF-3 以上开始显出差异：consistent splitting 通过把 PPE 中对流项外推阶数取为 `J-1`，比 dual splitting 获得更宽的稳定范围。

第三组实验是三维 Taylor-Green vortex，Reynolds 数为 1600，周期立方域中从光滑初值转捩到湍流。作者关注总动能、分子耗散率和数值耗散。用约 2100 万 velocity DoFs 的 consistent splitting 结果，与文献中更高分辨率结果吻合；在同一空间分辨率下，consistent splitting、dual splitting 和 coupled solution approach 的结果差异很小。这个算例说明，本文格式不是只在光滑解析解上工作；在欠解析湍流 benchmark 中，它的数值耗散和稳定性也达到了高阶 DG 求解器应有的水平。

<figure class="paper-figure">
  <svg viewBox="0 0 980 330" role="img" aria-label="Experiments and evidence">
    <g font-family="Inter, Arial, sans-serif" fill="currentColor">
      <line x1="92" y1="162" x2="888" y2="162" stroke="#9b8d7f" stroke-width="3" />
      <g font-size="16">
        <circle cx="150" cy="162" r="10" fill="#b85b2b" />
        <text x="98" y="120">制造解</text>
        <text x="66" y="202">2D Taylor-Green</text>
        <text x="72" y="226">验证 BDF 与空间阶</text>
        <circle cx="396" cy="162" r="10" fill="#1b756f" />
        <text x="342" y="120">工程 benchmark</text>
        <text x="326" y="202">圆柱绕流 2D-3</text>
        <text x="304" y="226">阻力/升力/压力差匹配参考</text>
        <circle cx="646" cy="162" r="10" fill="#293f67" />
        <text x="596" y="120">湍流转捩</text>
        <text x="566" y="202">3D Taylor-Green</text>
        <text x="548" y="226">动能与耗散对比文献</text>
        <circle cx="844" cy="162" r="10" fill="#b85b2b" />
        <text x="802" y="120">实现</text>
        <text x="786" y="202">ExaDG</text>
        <text x="742" y="226">matrix-based / matrix-free</text>
      </g>
    </g>
  </svg>
  <figcaption>图 2. 论文的证据链从解析解收敛性，到圆柱绕流力系数，再到三维 Taylor-Green vortex 的耗散行为。</figcaption>
</figure>

## 局限与启发

这篇论文的局限也很清楚。第一，它依赖压力 Poisson 方程；在大规模三维计算中，压力 Poisson 往往仍是瓶颈，虽然它比 saddle-point 系统更容易使用标准多重网格预条件。第二，本文实际采用 inf-sup stable 的速度/压力次数搭配 `k_u = k_p + 1`。作者指出，Leray projection 可能在某种意义上重新引入对函数空间搭配的要求；最低阶 equal-order 离散在高粘性问题中可能因为 curl-curl 边界项分辨不足而损失精度。

第三，BDF-3 和 BDF-4 提高精度的同时并不具备 BDF-1/2 那样的 A-stability 属性，因此高阶时间推进仍有常规稳定性边界。本文通过降低外推阶数和线性隐式对流项扩大了实用稳定范围，但不能理解为任意大步长都可靠。第四，iterated variant 的误差更低、鲁棒性更强，但每次迭代都要重复压力和速度线性系统，作者也把它更多作为理解和对照工具，而不是默认推荐方案。

真正值得带走的启发是：一致 pressure Poisson splitting 和高阶 DG 并不冲突。只要压力边界条件、数值通量、Leray 修正和 penalty 项设计得足够一致，就可以在避免 monolithic saddle-point 系统的同时，保留高阶时间精度并减少传统 projection 方法的 splitting error。对大规模不可压缩流软件来说，这是一条很务实的路线：压力和速度分开求，边界条件从原方程来，复杂度集中在可以被成熟多重网格处理的 Poisson 子问题上。

## 小结

本文把 Liu consistent splitting 从连续有限元/理论框架推进到一个完整的高阶 DG 求解器。它通过 modified pressure variable 把 Leray 投影融入单个压力 Poisson 步，用线性隐式对流项在稳定性和成本之间折中，再用 SIPG、散度 penalty 和法向连续性 penalty 处理 DG 空间中的边界与质量守恒问题。数值实验显示，该方法在解析解上达到高阶收敛，在圆柱绕流中匹配经典参考值，在三维 Taylor-Green vortex 中给出与现有高阶不可压缩流求解器相当的耗散表现。

它的定位不是“替代所有不可压缩流求解器”，而是在 coupled saddle-point 方法和传统 projection 方法之间提供一个结构更一致的高阶分裂选项。对于已经使用 DG、BDF、多重网格和 matrix-free 实现的大规模 CFD 代码，这种选项有很高的工程接口价值。

## 参考资料

- Still, D. T., Nebulishvili, N., Schussnig, R., Kormann, K., Kronbichler, M. [A discontinuous Galerkin consistent splitting method for the incompressible Navier-Stokes equations](https://doi.org/10.1016/j.cma.2026.119008). *Computer Methods in Applied Mechanics and Engineering*, 458:119008, 2026.
- Still, D. T., Nebulishvili, N., Schussnig, R., Kormann, K., Kronbichler, M. [arXiv:2512.05919](https://arxiv.org/abs/2512.05919), 2025/2026.
- Liu, J. [Open and traction boundary conditions for the incompressible Navier-Stokes equations](https://www.sciencedirect.com/science/article/abs/pii/S0021999109003453). *Journal of Computational Physics*, 228(19):7250-7267, 2009.
- Karniadakis, G. E., Israeli, M., Orszag, S. A. [High-order splitting methods for the incompressible Navier-Stokes equations](https://doi.org/10.1016/0021-9991(91)90007-8). *Journal of Computational Physics*, 97(2):414-443, 1991.
- Fehn, N., Wall, W. A., Kronbichler, M. [On the stability of projection methods for the incompressible Navier-Stokes equations based on high-order discontinuous Galerkin discretizations](https://arxiv.org/abs/1706.09252). *Journal of Computational Physics*, 351:392-421, 2017.
- ExaDG project. [High-order discontinuous Galerkin solvers](https://github.com/exadg/exadg).
