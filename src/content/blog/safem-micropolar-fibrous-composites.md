---
title: '每日论文精读：micropolar 纤维复合材料的半解析有限元均质化'
seoTitle: 'SAFEM 精读：micropolar 纤维复合材料、AHM 与有效模量'
description: '精读 AMM 2024 论文：如何把两尺度渐近均质化与有限元结合，计算 micropolar 纤维增强复合材料的有效刚度和力偶刚度。'
pubDate: 1777977135
sourceCheckedAt: 1777977135
slug: 'safem-micropolar-fibrous-composites'
category: '论文精读'
series: '每日论文精读'
tags: ['每日论文精读', 'micropolar', '均质化', '复合材料', '有限元']
paper:
  title: 'Semi-analytical finite element method applied for characterizing micropolar fibrous composites'
  authors: ['J. A. Otero', 'Y. Espinosa-Almeyda', 'R. Rodriguez-Ramos', 'J. Merodio']
  venue: 'Applied Mathematics and Mechanics (English Edition), 45(12), 2147-2164'
  year: 2024
  doi: '10.1007/s10483-024-3195-6'
  url: 'https://doi.org/10.1007/s10483-024-3195-6'
  pdfUrl: '/papers/s10483-024-3195-6-safem-micropolar-fibrous-composites.pdf'
  pdfFile: 's10483-024-3195-6-safem-micropolar-fibrous-composites.pdf'
---

> J. A. Otero, Y. Espinosa-Almeyda, R. Rodriguez-Ramos, J. Merodio. **Semi-analytical finite element method applied for characterizing micropolar fibrous composites**. *Applied Mathematics and Mechanics (English Edition)*, 45(12):2147-2164, 2024.  
> 链接：[DOI](https://doi.org/10.1007/s10483-024-3195-6) · [PDF](/papers/s10483-024-3195-6-safem-micropolar-fibrous-composites.pdf)

> 插图说明：本文图为自绘方法示意；原论文图片未检出明确开放复用声明，因此不直接转载。

## 文献信息与版本定位

这篇论文发表在 *Applied Mathematics and Mechanics (English Edition)* 45 卷第 12 期，页码 2147-2164，DOI 为 `10.1007/s10483-024-3195-6`。稿件 2024 年 7 月 19 日收到，2024 年 9 月 11 日修回。

论文研究的是**micropolar 线弹性纤维增强复合材料的有效性质计算**。材料由周期分布、单向排列的纤维和均匀基体组成；单元胞可以是方形排布，也可以是六角排布。作者使用两尺度渐近均质化方法推导局部问题和有效系数，再用有限元求解这些局部问题，这个组合被称为 SAFEM。

## 为什么需要 micropolar 均质化

经典连续介质只有位移自由度，宏观应力与应变对称，适合描述很多常规复合材料。但当微结构旋转、尺度效应或 couple stress 变得重要时，经典弹性会漏掉一部分响应。micropolar 理论额外引入独立微转角自由度，力学量中不仅有 force-stress，还有 couple-stress，因此可以描述材料点内部结构取向带来的效应。

对纤维复合材料来说，问题是：给定纤维体积分数、排布方式和基体/纤维材料参数，如何计算宏观等效的 micropolar 刚度和力偶刚度？解析解通常只适合非常规则的问题；直接数值模拟又很难形成可复用基准。SAFEM 的价值就在于给出一套介于解析推导和数值求解之间的基准流程。

<figure class="paper-figure">
  <svg viewBox="0 0 980 340" role="img" aria-label="SAFEM pipeline for micropolar fibrous composites">
    <defs>
      <marker id="safemArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
        <path d="M0,0 L0,6 L9,3 z" fill="#1b756f" />
      </marker>
    </defs>
    <rect x="22" y="24" width="936" height="292" rx="14" fill="none" stroke="#9b8d7f" stroke-opacity="0.45" />
    <g font-family="Inter, Arial, sans-serif" fill="currentColor">
      <rect x="58" y="82" width="188" height="126" rx="8" fill="#fffaf1" stroke="#b85b2b" />
      <text x="88" y="118" font-size="21">周期胞</text>
      <text x="78" y="150" font-size="15">方形/六角纤维排布</text>
      <text x="78" y="174" font-size="15">位移 + 微转角</text>
      <path d="M260 146 H334" stroke="#1b756f" stroke-width="5" marker-end="url(#safemArrow)" />
      <rect x="348" y="68" width="226" height="154" rx="8" fill="#fffaf1" stroke="#1b756f" />
      <text x="394" y="108" font-size="21">AHM 推导</text>
      <text x="382" y="140" font-size="15">局部问题</text>
      <text x="382" y="164" font-size="15">有效刚度/力偶系数</text>
      <text x="382" y="188" font-size="15">均质化边值问题</text>
      <path d="M588 146 H662" stroke="#1b756f" stroke-width="5" marker-end="url(#safemArrow)" />
      <rect x="676" y="82" width="228" height="126" rx="8" fill="#fffaf1" stroke="#293f67" />
      <text x="728" y="118" font-size="21">FEM 求解</text>
      <text x="708" y="150" font-size="15">Galerkin 弱式</text>
      <text x="708" y="174" font-size="15">输出等效性质表</text>
      <rect x="270" y="250" width="440" height="44" rx="8" fill="#f4efe6" stroke="#9b8d7f" />
      <text x="314" y="278" font-size="17">SAFEM = AHM 的局部问题 + FEM 数值求解</text>
    </g>
  </svg>
  <figcaption>图 1. SAFEM 并不是单纯有限元计算，而是先由两尺度渐近均质化给出局部问题，再用有限元稳定求解这些局部问题。</figcaption>
</figure>

## 方法机制

论文从三维静态线弹性 micropolar 问题出发。每个材料点有位移场 `u` 和微转角场 `omega`，对应非对称 force-stress 和 couple-stress。作者假设两相材料为 centro-symmetric，因此位移-微转角耦合张量为空，重点落在刚度张量 `C` 和力偶刚度张量 `D` 上。

两尺度渐近均质化 AHM 的作用是把快速变化的微观坐标和慢变宏观坐标分开。经过展开，可以得到局部单胞问题；解出这些局部问题后，就能组装宏观有效系数。由于局部问题一般无法手工求解，作者用 FEM 的 Galerkin 形式在 1/4 周期胞上求解，并利用对称性降低计算量。

论文中特别处理了 `13L2` 和 `11L2` 这类局部问题的弱形式。对读者来说，不必记住每一个指标，但要理解它们的含义：这些局部问题负责把宏观 strain、curvature 与微观位移/微转角响应联系起来，最后形成有效刚度矩阵。

## 数值结果

作者先用已有文献结果验证 SAFEM。材料系统是双相 elastic FRC，考虑方形和六角形周期胞。数值结果显示，SAFEM 可以给出与参考结果吻合的有效 stiffness 和 torque properties。

随后，论文系统考察纤维体积分数对有效性质的影响。结论可以概括为三点：

- 对方形和六角形纤维排布，均质后的 FRC 都表现出正交各向异性对称。
- 即使两相材料本身是各向同性，复合后的有效响应仍可以表现为各向异性。
- 有效 stiffness 随纤维体积分数单调增加；多数 torque properties 则呈相反趋势。

论文还比较了方形与六角形排布。方形分布在若干有效刚度和力偶刚度分量上高于六角分布，并且随着纤维体积分数增加，这种差异更明显。这说明在 micropolar 框架里，几何排布不仅改变传统刚度，也会改变与微旋转相关的等效参数。

## 局限与启发

本文的定位偏基础。它没有直接处理非线性、大变形、损伤或复杂随机纤维网络，而是给出一个可复现的基准：在静态线弹性 micropolar FRC 中，如何从 AHM 局部问题稳定计算有效性质。

这类工作对后续研究很有用。许多高阶连续介质模型难以验证，因为实验可测量量有限，数值实现也容易混入边界条件误差。SAFEM 给出一组有明确单胞、材料参数、边界条件和收敛路径的有效系数，可以作为其他算法或实验反演的对照。

## 小结

这篇论文的核心贡献，是把 micropolar FRC 的均质化从形式推导推进到可计算的 FEM 流程。它说明：一旦材料微结构中的旋转效应不可忽略，复合材料的等效性质就不应只看经典弹性刚度，还要看力偶刚度和微旋转相关参数。SAFEM 提供的不是最终工程软件，而是一套可靠的基准计算框架。

## 参考资料

- Otero, J. A., Espinosa-Almeyda, Y., Rodriguez-Ramos, R., Merodio, J. [Semi-analytical finite element method applied for characterizing micropolar fibrous composites](https://doi.org/10.1007/s10483-024-3195-6). *Applied Mathematics and Mechanics (English Edition)*, 45(12):2147-2164, 2024.
