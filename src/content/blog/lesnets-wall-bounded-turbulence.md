---
title: '每日论文精读：LESnets-WM 与壁面湍流的物理信息神经算子 LES'
seoTitle: 'LESnets-WM 精读：壁面湍流的物理信息神经算子 LES'
description: '精读 arXiv:2604.26621：从 FNO、PINO、LESnets 到壁面湍流 LES，理解硬边界约束、有限差分物理残差和壁模型在神经算子中的作用。'
pubDate: 1777907211
sourceCheckedAt: 1777937813
slug: 'lesnets-wall-bounded-turbulence'
category: '论文精读'
series: '每日论文精读'
tags: ['每日论文精读', '湍流', 'LES', '神经算子', 'PINO']
paper:
  title: 'Large-eddy simulation nets (LESnets) based on physics-informed neural operator for wall-bounded turbulence'
  authors: ['Sunan Zhao', 'Yunpeng Wang', 'Huiyu Yang', 'Zhihong Guo', 'Jianchun Wang']
  venue: 'arXiv'
  year: 2026
  doi: '10.48550/arXiv.2604.26621'
  arxiv: '2604.26621'
  url: 'https://arxiv.org/abs/2604.26621'
  pdfUrl: '/papers/arxiv-2604.26621-lesnets-wall-bounded-turbulence.pdf'
  pdfFile: 'arxiv-2604.26621-lesnets-wall-bounded-turbulence.pdf'
---

> Sunan Zhao, Yunpeng Wang, Huiyu Yang, Zhihong Guo, Jianchun Wang. **Large-eddy simulation nets (LESnets) based on physics-informed neural operator for wall-bounded turbulence**. arXiv:2604.26621v1, 2026-04-29.  
> 链接：[arXiv](https://arxiv.org/abs/2604.26621) · [arXiv DOI](https://doi.org/10.48550/arXiv.2604.26621)

## 文献信息与版本定位

这篇预印本研究的是 **wall-bounded turbulence**，即壁面约束下的三维不可压缩槽道湍流。它与 2025 年 Journal of Computational Physics 上的前作 **LESnets (Large-Eddy Simulation nets): Physics-informed neural operator for large-eddy simulation of turbulence** 属于同一研究线，但不是同一篇论文。后者对应 DOI [10.1016/j.jcp.2025.114125](https://doi.org/10.1016/j.jcp.2025.114125) 和 arXiv:2411.04502，主要算例是三维衰减均匀各向同性湍流和时间演化混合层。本文则把 LESnets 推进到壁面湍流，并引入硬边界约束、非均匀网格有限差分残差和壁模型。

| 文献 | 主要对象 | 方法位置 | 状态 |
|---|---|---|---|
| LESnets, JCP 537, 114125, 2025 | 3D HIT、turbulent mixing layer | 将 LES 方程写入神经算子训练损失 | 已发表，DOI: 10.1016/j.jcp.2025.114125 |
| 本文，arXiv:2604.26621, 2026 | 3D turbulent channel flow | LESnets + F-FNO + 硬边界 + 有限差分残差 + wall model | 预印本 |

这种区分很重要。若把 JCP DOI 直接套到本文，会误判作者列表、研究对象、算例、性能结论和代码状态。本文在代码可用性部分说明，代码和数据计划在论文接收后公开。

## 技术脉络

壁面湍流的机器学习求解并不是单独从 FNO 开始的。理解本文，需要把它放到四条技术线索的交汇处。

第一条线索是传统湍流模拟。DNS 解析全部湍流尺度，物理精确但高 Reynolds 数下代价极高；RANS 求平均场，效率高但瞬态结构能力弱；LES 只解析大尺度结构，用 SGS 模型闭合小尺度影响，成为工程湍流模拟的重要折中。壁面湍流又进一步带来近壁小尺度结构，wall-resolved LES 的网格代价会随 Reynolds 数迅速上升，因此 wall-modeled LES 通过壁模型近似近壁剪切应力，是高 Reynolds 数壁湍流中的常用策略。

第二条线索是神经算子。DeepONet 和 FNO 将学习目标从有限维向量映射提升到函数空间算子映射，使模型能够学习一族 PDE 解算子。FNO 通过频域卷积高效捕捉全局相互作用，但标准 FNO 对周期边界和规则网格更自然。随后出现的 F-FNO 将三维频域操作因子化为多个一维方向操作，降低参数规模，也更适合处理三维湍流中各方向尺度差异。

第三条线索是物理信息神经算子。PINO 不只用标签数据训练神经算子，而是把 PDE 残差加入损失函数，使预测场受到控制方程约束。对于湍流问题，这类约束有两个价值：一是降低标签数据依赖，二是抑制长时递推中的非物理漂移。但湍流的多尺度、非线性和敏感依赖初值也使 PINO 的稳定训练更困难。

第四条线索是 LESnets。2025 年的 LESnets 将 LES 方程嵌入 FNO 类模型，用物理残差训练大涡模拟代理模型。本文的贡献是把这套框架推进到 **壁面湍流**，也就是引入此前通用 LESnets 不需要面对的三类困难：壁面非周期边界、壁法向非均匀网格、近壁区的壁律约束。

## 问题定义

本文关注三维槽道流。计算域为 `Lx × Ly × Lz = 4π × 2 × 4π/3`，流向和展向周期，壁法向有上下固壁。研究目标不是从粗网格直接重建 DNS 级细网格，而是在粗网格 LES/WMLES 状态上学习一个可递推的时间推进算子：

`当前粗网格速度/压力场 -> 下一时间间隔的粗网格速度/压力场`

训练阶段，模型输出会被送入 LES 方程、SGS 模型、边界条件和壁模型构成的物理损失中；推理阶段，模型将上一时刻预测结果作为下一次输入，循环推进长时间流场。

<figure class="paper-figure">
  <svg viewBox="0 0 980 360" role="img" aria-label="LESnets-WM workflow">
    <defs>
      <linearGradient id="flowA" x1="0" x2="1">
        <stop offset="0%" stop-color="#b85b2b" stop-opacity="0.92" />
        <stop offset="100%" stop-color="#1b756f" stop-opacity="0.92" />
      </linearGradient>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#1b756f" />
      </marker>
    </defs>
    <rect x="20" y="24" width="940" height="312" rx="14" fill="none" stroke="#9b8d7f" stroke-opacity="0.45" />
    <g font-family="Inter, Arial, sans-serif" font-size="22" fill="currentColor">
      <rect x="58" y="90" width="160" height="86" rx="8" fill="#fffaf1" stroke="#b85b2b" />
      <text x="80" y="125">LES 状态</text>
      <text x="80" y="155" font-size="16">u, v, w, p @ t</text>
      <path d="M230 133 H312" stroke="url(#flowA)" stroke-width="5" marker-end="url(#arrow)" />
      <rect x="326" y="70" width="176" height="126" rx="8" fill="#fffaf1" stroke="#1b756f" />
      <text x="360" y="112">F-FNO</text>
      <text x="350" y="145" font-size="16">x / y / z 方向因子化</text>
      <text x="350" y="171" font-size="16">频域算子学习</text>
      <path d="M514 133 H594" stroke="url(#flowA)" stroke-width="5" marker-end="url(#arrow)" />
      <rect x="608" y="70" width="188" height="126" rx="8" fill="#fffaf1" stroke="#293f67" />
      <text x="640" y="112">硬约束</text>
      <text x="634" y="145" font-size="16">初始条件</text>
      <text x="634" y="171" font-size="16">壁面边界条件</text>
      <path d="M704 206 V254 H218 V188" stroke="#1b756f" stroke-width="3" stroke-dasharray="8 8" fill="none" />
      <rect x="608" y="228" width="278" height="72" rx="8" fill="#f4efe6" stroke="#b85b2b" />
      <text x="634" y="258">物理损失</text>
      <text x="634" y="284" font-size="16">LES 方程 + WALE + wall model</text>
    </g>
  </svg>
  <figcaption>图 1. LESnets-WM 的基本流程。神经算子负责时间推进，训练损失由 LES 离散残差、SGS 模型、硬边界约束和壁模型共同构成。</figcaption>
</figure>

## 方法机制

### F-FNO：面向三维湍流的算子骨架

标准 FNO 的三维 Fourier layer 参数量与三个方向 Fourier modes 的乘积相关。F-FNO 将三维频域算子分解为沿 x、y、z 三个方向的一维频域操作，再将结果组合。这样一方面减少参数量，另一方面更符合槽道流中流向、壁法向、展向统计特征不同的事实。

本文没有把 F-FNO 当作纯数据驱动模型使用，而是将其嵌入 LESnets 框架。F-FNO 输出一段时间后的速度/压力场，随后通过物理模块计算残差并更新网络参数。

### 有限差分物理残差：从周期谱方法转向壁面流

前作 LESnets 可以在周期问题中使用谱方法计算物理残差。壁面湍流不同：壁法向非周期，网格还会在近壁区拉伸。本文因此改用有限差分离散计算物理损失，并采用 WALE 模型作为 SGS 闭合。这个改动看似工程化，但对壁面湍流是关键，因为物理损失必须与实际离散网格和边界条件兼容。

### 硬边界约束：防止近壁误差在长时递推中累积

PINO 中常见做法是在损失函数中加入边界项，属于软约束。本文选择把初始条件和上下壁边界条件直接硬编码到预测场中，再计算 PDE 残差。对于壁面湍流，这种设计比单纯加权边界损失更稳健，因为近壁区小误差会在递推中持续反馈到全场统计。

### Wall model：高 Reynolds 数粗网格 LES 的必要先验

在 `Re_tau≈1000` 算例中，模型采用 LESnets-WM，即在 physics-informed loss 中加入 Inagaki 等人的三层匹配 wall model。壁模型使用离壁第 6 个网格点的速度和法向距离估计摩擦速度，再给出壁面剪切应力。这样做的目的不是让模型显式解析所有近壁小尺度，而是在粗网格上约束 log-law 区域的平均流动。

## 实验设置

本文测试三个摩擦 Reynolds 数：`Re_tau≈180`、`590`、`1000`。其中 `180` 和 `590` 与 DNS、过滤 DNS、WALE LES 进行对比；`1000` 使用 WMLES 和 DNS 统计量作为主要参考。

<div class="paper-grid">
  <div class="paper-tile"><strong>Re_tau≈180</strong><span>DNS: 128×129×128；WALE/LESnets: 32×65×32；Δy_w^+=1.94 for WALE</span></div>
  <div class="paper-tile"><strong>Re_tau≈590</strong><span>DNS: 384×257×192；WALE/LESnets: 64×65×64；Δy_w^+=6.14 for WALE</span></div>
  <div class="paper-tile"><strong>Re_tau≈1000</strong><span>WMLES/LESnets-WM: 32×65×32；Δy_w^+=11.46；第 6 个离壁点用于 wall model</span></div>
</div>

训练数据来自 LES/WMLES 瞬时流场。每个 Reynolds 数构造 20 组训练样本，每组包含 200 个训练时间步，训练时间间隔为 `Δt_train = ΔT = 200Δt = 1.0`。对比模型包括 IUFNO、F-FNO 和 LESnets。IUFNO 与 F-FNO 代表数据驱动神经算子基线，LESnets 则加入物理信息损失。

## 主要结果

### Re_tau≈180 和 590：LESnets 的统计量更接近 WALE

在 `Re_tau≈180` 和 `590` 的长时推理中，IUFNO 容易出现速度时间序列偏离和非物理能谱偏差；F-FNO 与 LESnets 整体更稳定。平均流速 `U+`、剪切 Reynolds 应力、RMS 脉动、能谱和 Q criterion 结构的对比显示，LESnets 在多数统计量上比 IUFNO 更接近 WALE。F-FNO 在部分 `Re_tau≈180` 统计量上可与 LESnets 相当甚至略优，但在更高 Reynolds 数和长时结构保持上，物理残差带来的约束更有价值。

这个结果说明，F-FNO 的结构改进已经能显著提高三维壁面流预测能力；LESnets 的进一步价值在于用 LES 方程和边界物理减少长期递推的非物理漂移。

### Re_tau≈1000：wall model 决定近壁统计质量

高 Reynolds 数算例更能体现本文相对前作的扩展意义。在 `Re_tau≈1000` 中，F-FNO 和 IUFNO 在 log-law 区域与能谱分布上偏差明显；LESnets-WM 通过壁模型约束壁面剪切应力，在平均速度剖面、展向能谱、流向与展向 RMS 脉动上整体优于两个数据驱动基线。作者特别指出，wall model 的引入不改变推理阶段效率，因为推理仍由训练好的神经算子循环推进。

### 计算效率：应按表格口径理解

论文报告的计算成本是每 10,000 个数值步的 wall-clock 时间：

| Re_tau | WALE | IUFNO | F-FNO | LESnets |
|---|---:|---:|---:|---:|
| 180 | 38.5 s × 16 cores | 28.8 s | 4.2 s | 4.2 s |
| 590 | 139.8 s × 32 cores | 35.3 s | 15.0 s | 15.0 s |

因此，稳妥的表述是：LESnets 在保持 F-FNO 推理效率的同时，明显快于 WALE 基线，并获得接近传统 LES 的统计表现。不能从本文表格直接推出统一的 `10^3` 倍加速，也不能概括为所有一阶统计量误差均小于 5%。

<figure class="paper-figure">
  <svg viewBox="0 0 920 300" role="img" aria-label="relative computational cost">
    <rect x="28" y="28" width="864" height="244" rx="12" fill="none" stroke="#9b8d7f" stroke-opacity="0.45" />
    <g font-family="Inter, Arial, sans-serif" font-size="18">
      <text x="58" y="68" fill="currentColor">每 10,000 个数值步的 wall-clock 时间</text>
      <text x="58" y="115" fill="currentColor">Re_tau≈180</text>
      <rect x="190" y="96" width="385" height="24" rx="5" fill="#b85b2b" opacity="0.8" />
      <rect x="190" y="132" width="42" height="24" rx="5" fill="#1b756f" opacity="0.9" />
      <text x="590" y="115" fill="currentColor">WALE 38.5s</text>
      <text x="248" y="151" fill="currentColor">LESnets 4.2s</text>
      <text x="58" y="210" fill="currentColor">Re_tau≈590</text>
      <rect x="190" y="191" width="560" height="24" rx="5" fill="#b85b2b" opacity="0.8" />
      <rect x="190" y="227" width="60" height="24" rx="5" fill="#1b756f" opacity="0.9" />
      <text x="765" y="210" fill="currentColor">WALE 139.8s</text>
      <text x="266" y="246" fill="currentColor">LESnets 15.0s</text>
    </g>
  </svg>
  <figcaption>图 2. 根据论文表格整理的 wall-clock 成本示意。该图只表达文中同表口径下的相对量级，不代表跨硬件平台的严格加速比。</figcaption>
</figure>

## 与相关工作的关系

本文可以看作 LESnets 技术线向壁面流问题的自然延伸。它继承了 2025 年 LESnets 的核心思想：用神经算子承担快速时间推进，用 LES 方程残差约束训练。但壁面湍流需要额外处理非周期边界、非均匀网格和壁律，因此本文相对前作的技术增量主要体现在三个方面：

1. 从普通 FNO 转向 F-FNO，适应三维槽道流的方向差异。
2. 从周期谱残差转向有限差分残差，适应壁面非周期边界和拉伸网格。
3. 从纯 LES physics loss 扩展到 LESnets-WM，将 wall model 写入物理损失，面向更高 Reynolds 数。

与纯数据驱动 IUFNO/F-FNO 相比，LESnets 的优势不在短时逐点误差一定最小，而在长时统计量和物理结构保持上更稳。与传统 WALE/WMLES 相比，它的优势是推理成本低；限制则是泛化范围和鲁棒性仍需要更多复杂流动验证。

## 局限

本文目前仍局限于不可压缩槽道流。复杂几何、分离流、粗糙壁面、压力梯度边界层和可压缩壁湍流尚未验证。`Re_tau≈1000` 的结论依赖特定 wall model、网格配置和第 6 个离壁采样点，换用不同网格或壁模型时需要重新评估。代码和数据尚未公开，也限制了独立复现。

此外，性能比较需要谨慎理解。传统 WALE 使用 CPU 多核，而神经算子推理通常更适合 GPU；若没有统一硬件与实现，速度数字只能说明当前实验设置下的量级差异，不能直接推广到所有 LES 场景。

## 小结

本文的核心价值不是简单地把 FNO 用到壁面湍流，而是展示了物理信息神经算子在工程湍流问题中必须与数值离散和物理模型共同设计。对于壁面 LES，只有神经算子结构是不够的；边界条件、SGS 模型、有限差分残差和 wall model 都需要进入训练框架。LESnets-WM 因此提供了一种有代表性的路线：用神经算子提供快速可递推解算器，用 LES 与壁面物理限制其长期演化。

## 参考资料

- [arXiv:2604.26621](https://arxiv.org/abs/2604.26621)：本文预印本。
- [arXiv:2411.04502](https://arxiv.org/abs/2411.04502)：2025 年 LESnets JCP 论文的 arXiv 版本。
- [Journal of Computational Physics 537, 114125](https://doi.org/10.1016/j.jcp.2025.114125)：LESnets 前作的期刊版本。
