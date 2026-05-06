---
title: '每日论文精读：HTS 复合磁体的 GH-LR 多尺度多场分析'
seoTitle: 'HTS 复合磁体 GH-LR 精读：REBCO、T-A 模型与局部细化'
description: '精读 AMM 2024 论文：如何用全局均质化和局部细化，在 REBCO 高温超导复合磁体中平衡电磁-热弹多场计算精度与效率。'
pubDate: 1777977075
sourceCheckedAt: 1777977075
slug: 'hts-composite-magnets-gh-lr-multiscale'
category: '论文精读'
series: '每日论文精读'
tags: ['每日论文精读', '超导磁体', '多尺度分析', '均质化', '复合材料']
paper:
  title: 'Integrated multi-scale approach combining global homogenization and local refinement for multi-field analysis of high-temperature superconducting composite magnets'
  authors: ['Hanxiao Guo', 'Peifeng Gao', 'Xingzhe Wang']
  venue: 'Applied Mathematics and Mechanics (English Edition), 45(5), 747-762'
  year: 2024
  doi: '10.1007/s10483-024-3112-8'
  url: 'https://doi.org/10.1007/s10483-024-3112-8'
  pdfUrl: '/papers/s10483-024-3112-8-hts-composite-magnets-gh-lr.pdf'
  pdfFile: 's10483-024-3112-8-hts-composite-magnets-gh-lr.pdf'
---

> Hanxiao Guo, Peifeng Gao, Xingzhe Wang. **Integrated multi-scale approach combining global homogenization and local refinement for multi-field analysis of high-temperature superconducting composite magnets**. *Applied Mathematics and Mechanics (English Edition)*, 45(5):747-762, 2024.  
> 链接：[DOI](https://doi.org/10.1007/s10483-024-3112-8) · [PDF](/papers/s10483-024-3112-8-hts-composite-magnets-gh-lr.pdf)

> 插图说明：本文图为根据论文内容自绘的路线图，不直接转载论文原图；论文 PDF 中的原始图片已可通过本地 `pdf-figure-reader` 技术路线提取用于核对。

## 文献信息与版本定位

这篇论文发表在 *Applied Mathematics and Mechanics (English Edition)* 45 卷第 5 期，页码 747-762，DOI 为 `10.1007/s10483-024-3112-8`。稿件 2024 年 1 月 4 日收到，2024 年 3 月 20 日修回。

研究对象是**环氧浸渍 REBCO 高温超导复合磁体**。这类磁体由多层 coated conductor tape 绕制而成，内部既有超导层，也有铜稳定层、Hastelloy 基底、绝缘层和环氧等材料。问题的困难在于：电磁场、热应力和机械应力强耦合，而超导层又非常薄。如果全模型逐层细化，计算量会爆炸；如果只做均质化，又看不到真正危险的层间应力和局部失效风险。

## 问题定义

REBCO coated conductor 在高场磁体中很有吸引力，但它的力学脆弱性同样明显。低温冷却会产生热失配应力，励磁会带来电磁力，screening current 又会使局部力和应力分布变得不均匀。超导层本身是脆性陶瓷，层间脱粘、微裂纹或局部损伤都可能导致临界电流下降，进而威胁磁体稳定性。

传统建模有两端：

| 建模方式 | 优点 | 问题 |
|---|---|---|
| 全细化 FR | 能解析每一层材料响应 | 自由度巨大，大型磁体难以承受 |
| 均质化模型 | 适合整体电磁-热弹计算 | 容易抹掉层内差异，无法可靠判断危险层 |

本文提出的 GH-LR 路线正是折中：先在宏观尺度上用全局均质化找到危险区域，再在局部区域做细化层级分析。

## 技术路线

<figure class="paper-figure">
  <svg viewBox="0 0 980 360" role="img" aria-label="GH-LR workflow for HTS composite magnets">
    <defs>
      <linearGradient id="htsFlow" x1="0" x2="1">
        <stop offset="0%" stop-color="#1b756f" stop-opacity="0.92" />
        <stop offset="100%" stop-color="#b85b2b" stop-opacity="0.92" />
      </linearGradient>
      <marker id="htsArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
        <path d="M0,0 L0,6 L9,3 z" fill="#1b756f" />
      </marker>
    </defs>
    <rect x="22" y="24" width="936" height="312" rx="14" fill="none" stroke="#9b8d7f" stroke-opacity="0.45" />
    <g font-family="Inter, Arial, sans-serif" fill="currentColor">
      <rect x="56" y="86" width="190" height="132" rx="8" fill="#fffaf1" stroke="#1b756f" />
      <text x="92" y="122" font-size="21">宏观 GH</text>
      <text x="82" y="154" font-size="15">均质 T-A 电磁模型</text>
      <text x="82" y="178" font-size="15">正交热弹均质模型</text>
      <path d="M260 152 H334" stroke="url(#htsFlow)" stroke-width="5" marker-end="url(#htsArrow)" />
      <rect x="348" y="72" width="236" height="160" rx="8" fill="#fffaf1" stroke="#b85b2b" />
      <text x="396" y="112" font-size="21">危险区域识别</text>
      <text x="382" y="146" font-size="15">最大 von Mises 应力</text>
      <text x="382" y="170" font-size="15">最大磁场/电磁力位置</text>
      <text x="382" y="194" font-size="15">内圈与端部 pancake</text>
      <path d="M598 152 H672" stroke="url(#htsFlow)" stroke-width="5" marker-end="url(#htsArrow)" />
      <rect x="686" y="86" width="218" height="132" rx="8" fill="#fffaf1" stroke="#293f67" />
      <text x="730" y="122" font-size="21">局部 LR</text>
      <text x="714" y="154" font-size="15">恢复 REBCO tape 层级</text>
      <text x="714" y="178" font-size="15">计算各材料应力应变</text>
      <rect x="240" y="264" width="500" height="54" rx="8" fill="#f4efe6" stroke="#9b8d7f" />
      <text x="284" y="298" font-size="17">目标：接近 FR 的局部精度，同时保留 GH 的整体效率</text>
    </g>
  </svg>
  <figcaption>图 1. GH-LR 的关键是把“全局场求解”和“局部层级风险评估”拆开：先找危险位置，再在局部恢复复合 tape 的真实层状结构。</figcaption>
</figure>

宏观部分使用均质化 T-A 方法计算电磁场。`T` 表示电流矢量势，`A` 表示磁矢势；这条路线适合薄超导层的高效建模。热弹部分则把 REBCO tape 视为正交各向异性均质材料，通过微观 RVE 给出等效参数。这样可以在磁体尺度上得到电流密度、磁场、电磁力和应力的整体分布。

局部部分不是对整个磁体都细化，而是只对宏观结果识别出的危险区域做 LR。论文中特别关注最大 von Mises 应力和最大径向应力附近的 REBCO tape，把其层级结构恢复出来，分析 Hastelloy、铜稳定层、REBCO 层、环氧和绝缘层的应力应变。

## 数值结果

第一组验证是小尺度 pancake coil。作者把 GH-LR 与全细化 FR 模型、实验数据进行比较。宏观均质模型可以较好给出整体场分布，但在层内应力上会出现偏差；GH-LR 则能更接近 FR，同时避免全局逐层细化的巨大代价。

第二组是大型 HTS 磁体。论文显示，screening current effect 在靠近磁体端部的 pancake 中更明显，并会导致电磁力和局部应力的非均匀分布。危险区域主要集中在 pancake coil 的内侧 turn，尤其需要关注高 von Mises 应力和高磁场位置。

第三组结果是局部层级分析。论文指出，Hastelloy 基底和铜稳定层承担了主要应力，环氧和 polyamide 绝缘层承载贡献较小。在一个关键区域中，screening current 导致 tape 宽度方向上 Hastelloy 的 von Mises 应力上下部分相差约 28%；REBCO 层下部相比上部出现约 227 MPa 的 von Mises 应力增加。这说明只看均质应力很容易低估局部层级风险。

计算效率也很突出。表 3 中，FR 模型自由度约 `24,479,862`，计算时间为 `13 h 10 min 53 s`；GH-LR 中宏观 GH 模型自由度约 `645,942`，局部 LR 约 `43,396`，计算时间为 `46 min 50 s`。论文据此报告了约 17 倍的整体效率提升。

## 局限与启发

这篇论文的贡献不是提出新的超导材料本构，而是给大型 HTS 复合磁体提供一种可落地的多尺度计算流程。它的强项在于“局部细化被宏观场引导”，适合工程设计中反复筛查危险区域。

局限也比较明确。首先，局部 LR 依赖宏观危险区域识别，如果宏观均质模型遗漏了关键风险点，后续局部细化也无法弥补。其次，论文主要处理电磁-热弹响应，还没有把界面损伤、裂纹扩展和退化后的超导性能反馈完整耦合进去。最后，GH-LR 比 FR 高效，但仍需要为局部模型准备合理的边界传递和材料层级参数。

## 小结

GH-LR 的思想非常适合 REBCO 这类“全局尺寸大、局部层级薄、危险位置少而关键”的复合结构。它用 GH 解决整体多场分布，用 LR 回到层级细节，既避免全模型细化，又不满足于过度均质化的平均答案。对高场超导磁体设计来说，这类方法的价值在于把失效风险评估从“看整体等效应力”推进到“看具体哪一层、哪一段 tape 更危险”。

## 参考资料

- Guo, H. X., Gao, P. F., Wang, X. Z. [Integrated multi-scale approach combining global homogenization and local refinement for multi-field analysis of high-temperature superconducting composite magnets](https://doi.org/10.1007/s10483-024-3112-8). *Applied Mathematics and Mechanics (English Edition)*, 45(5):747-762, 2024.
