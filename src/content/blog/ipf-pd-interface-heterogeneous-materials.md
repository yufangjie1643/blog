---
title: '每日论文精读：异质材料界面的 IPF-PD 相场-近场动力学耦合'
seoTitle: 'IPF-PD 精读：界面相场、近场动力学与异质材料界面失效'
description: '精读 Composite Structures 2025 论文：如何把界面相场序参量引入近场动力学，用连续扩散的界面参数描述异质材料的界面变形、损伤与裂纹扩展。'
pubDate: 1777999159
sourceCheckedAt: 1777999159
slug: 'ipf-pd-interface-heterogeneous-materials'
category: '论文精读'
series: '每日论文精读'
tags: ['每日论文精读', '近场动力学', '相场方法', '界面损伤', '异质材料']
paper:
  title: 'Phase field-peridynamics coupling method for interface mechanical properties of heterogeneous materials: Model and validation'
  authors: ['Yongsheng Liu', 'Haoran Xu', 'Chengbei He', 'Jianxin Xia']
  venue: 'Composite Structures, 356, 118887'
  year: 2025
  doi: '10.1016/j.compstruct.2025.118887'
  url: 'https://doi.org/10.1016/j.compstruct.2025.118887'
  pdfUrl: '/papers/S0263822325000522-phase-field-peridynamics-interface.pdf'
  pdfFile: 'S0263822325000522-phase-field-peridynamics-interface.pdf'
---

> Yongsheng Liu, Haoran Xu, Chengbei He, Jianxin Xia. **Phase field-peridynamics coupling method for interface mechanical properties of heterogeneous materials: Model and validation**. *Composite Structures*, 356:118887, 2025.  
> 链接：[DOI](https://doi.org/10.1016/j.compstruct.2025.118887) · [PDF](/papers/S0263822325000522-phase-field-peridynamics-interface.pdf)

> 插图说明：本文插图为自绘结构示意。PDF 版权页显示 Elsevier 保留权利，因此不直接转载原论文图。

## 文献信息与问题定位

这篇论文研究的是异质材料界面力学行为，特别是界面附近材料参数突变、裂纹萌生和界面脱粘如何在近场动力学框架中表达。论文 2024 年 11 月 11 日投稿，2025 年 1 月 9 日修回，2025 年 1 月 21 日接收，发表在 *Composite Structures* 356 卷，文章号 118887。

近场动力学的优势是用积分形式和键断裂描述裂纹，不需要在裂尖处处理经典连续介质力学里的奇异性。但异质界面会带来另一个困难：材料参数在界面两侧突变，界面层本身又可能有自己的刚度、断裂韧性和损伤演化。如果直接给跨界面的 bond 人工设参数，模型的理论依据往往不够清楚。

作者的解决方案是把 **interface phase field** 引入 peridynamics，形成 IPF-PD 耦合模型。相场变量不用于演化裂纹本身，而是用于把零厚度离散界面扩散成连续过渡区，让 bond stiffness 和 critical elongation 随界面序参量连续变化。

<figure class="paper-figure">
  <svg viewBox="0 0 980 330" role="img" aria-label="IPF-PD interface diffusion">
    <defs>
      <marker id="ipfpdArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
        <path d="M0,0 L0,6 L9,3 z" fill="#1b756f" />
      </marker>
    </defs>
    <rect x="24" y="24" width="932" height="282" rx="12" fill="none" stroke="#9b8d7f" stroke-opacity="0.45" />
    <g font-family="Inter, Arial, sans-serif" fill="currentColor">
      <rect x="68" y="86" width="210" height="124" rx="8" fill="#fffaf1" stroke="#b85b2b" />
      <text x="104" y="122" font-size="20">离散界面</text>
      <text x="92" y="154" font-size="15">材料参数突变</text>
      <text x="92" y="178" font-size="15">跨界 bond 难设定</text>
      <path d="M294 148 H370" stroke="#1b756f" stroke-width="5" marker-end="url(#ipfpdArrow)" />
      <rect x="386" y="74" width="230" height="148" rx="8" fill="#fffaf1" stroke="#1b756f" />
      <text x="430" y="112" font-size="20">界面相场 λ</text>
      <text x="416" y="144" font-size="15">把零厚度界面扩散</text>
      <text x="416" y="168" font-size="15">保持断裂能等价修正</text>
      <text x="416" y="192" font-size="15">连续插值 E 与 Gc</text>
      <path d="M632 148 H708" stroke="#1b756f" stroke-width="5" marker-end="url(#ipfpdArrow)" />
      <rect x="724" y="86" width="188" height="124" rx="8" fill="#fffaf1" stroke="#293f67" />
      <text x="762" y="122" font-size="20">IPF-PD</text>
      <text x="748" y="154" font-size="15">bond 刚度连续化</text>
      <text x="748" y="178" font-size="15">界面脱粘可演化</text>
    </g>
  </svg>
  <figcaption>图 1. IPF-PD 的核心不是另起一套裂纹模型，而是用界面相场把界面力学参数连续化，再嵌入近场动力学的键力和断裂判据。</figcaption>
</figure>

## 方法机制

论文从一个零厚度界面出发，用标量函数表示界面位置。随后借鉴相场裂纹里的扩散思想，引入界面相场函数 `λ(x)`，其特征宽度由 `li` 控制。当 `li` 趋近于 0 时，扩散界面退化回离散界面。

材料参数的过渡通过形函数完成。对任意参数 `Θ`，扩散后的参数写成界面参数和基体参数的连续组合。文中给出的插值形式相当于让 `λ=1` 的位置保持界面属性，远离界面后逐渐回到基体属性。这样，弹性模量、断裂韧性等参数不再在界面处跳变。

一个关键细节是断裂能修正。扩散界面会改变有效界面宽度，如果不修正，界面失效消耗的能量就不等于原始零厚度界面的断裂能。作者因此推导了扩散前后界面断裂能守恒关系，并把修正后的能量释放率用于 peridynamics 的临界伸长表达式。

在 peridynamics 部分，作者以 bond-based PD 为例，把界面相场引入 bond stiffness 和 critical elongation。这样，材料点之间的相互作用会根据所处的界面过渡区连续变化。文中也指出，这个思路原则上可扩展到 ordinary state-based、non-ordinary state-based 或扩展 bond-based PD，但本文验证主要放在标准 bond-based 情形。

## 验证设计

论文用了三类验证。

第一类是含两个增强体的拉伸变形，与有限元解对比。这个算例不强调损伤，而是检查弹性阶段位移场是否随材料点间距减小而收敛。结果显示，材料点离散越细，IPF-PD 位移分布越接近有限元解。

第二类是环氧树脂-聚丙烯双材料板拉伸试验，使用 DIC 获取全场位移和应变。论文比较了 DIC 中心线位移与 IPF-PD 预测，两个材料段的 Pearson 线性相关系数分别为 0.84 和 0.98。DIC 应变集中区与模型中的界面损伤位置一致，说明模型能抓住界面处的变形差异和破坏位置。

第三类是单圆形增强体拉伸，用界面脱粘角与理论值和已有模型对比。理论脱粘角为 67.11°，IPF-PD 模拟得到 66.20°，误差小于 1.37%。裂纹先沿界面成一定角度脱粘，随后偏转进入基体并以 I 型裂纹形式扩展，这与文献中的界面裂纹路径一致。

<div class="paper-grid">
  <div class="paper-tile"><strong>FEM 对照</strong><span>检查弹性阶段位移场收敛，材料点间距减小时逐步接近有限元结果。</span></div>
  <div class="paper-tile"><strong>DIC 实验</strong><span>双材料拉伸中，位移曲线相关系数达到 0.84 和 0.98，损伤位置对应应变集中区。</span></div>
  <div class="paper-tile"><strong>界面脱粘角</strong><span>圆形增强体算例给出 66.20°，与理论 67.11° 的误差小于 1.37%。</span></div>
</div>

## 贡献与边界

这篇文章的贡献在于给 peridynamics 里的异质界面参数一个更连续、更可解释的表达方式。它不是简单给界面 bond 指定经验刚度，而是通过界面相场把参数扩散成连续场，并用断裂能守恒保证扩散后界面能量仍然对应原始界面。

它的边界也很清楚。第一，验证集中在二维或准二维界面问题，还不是复杂三维复合材料结构的大规模工程验证。第二，本文以 bond-based PD 为主要验证对象，虽然作者说明可扩展到其他 PD 形式，但不同状态型模型中的具体实现还需要进一步展示。第三，DIC 试验用于验证界面拉伸变形和失效位置，不能直接证明所有混合模态、疲劳或热-力耦合界面问题都同样准确。

## 小结

IPF-PD 的思路适合用来处理异质材料中“界面不是几何线，而是力学过渡层”的问题。相场负责把界面属性连续化，近场动力学负责处理非局部相互作用和裂纹自然扩展。对复合材料界面脱粘、增强体周围裂纹偏转和材料参数强跳变问题，这种组合给出了一个比经验跨界 bond 更有物理解释的建模入口。

## 参考资料

- Liu, Y., Xu, H., He, C., Xia, J. [Phase field-peridynamics coupling method for interface mechanical properties of heterogeneous materials: Model and validation](https://doi.org/10.1016/j.compstruct.2025.118887). *Composite Structures*, 356:118887, 2025.
