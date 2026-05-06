---
title: '研究提案：TexGen 驱动的编织复合材料体素界面损伤基准'
seoTitle: '编织复合材料体素界面损伤基准：研究 idea、实用性、可行性与技术路线'
description: '以研究者汇报的角度，提出一个 TexGen 驱动的编织复合材料体素界面损伤 benchmark：比较 hard voxel、stress averaging、composite voxel、diffuse-interface phase-field 与贴体网格参考，建立体素损伤模型的适用性地图。'
pubDate: 1778005260
updatedDate: 1778006559
sourceCheckedAt: 1778006559
slug: 'interface-energy-preserving-voxel-phase-field-damage'
category: '研究设想'
series: '论文选题构思'
tags: ['研究设想', '文献调研', '编织复合材料', '体素模型', '相场断裂', '界面损伤', '多尺度分析']
featured: true
---

这篇文章是一个研究提案，而不是单篇论文精读。我想汇报的 idea 是：

> 建立一个 **TexGen 驱动的编织复合材料体素界面损伤基准**，系统比较 hard voxel、stress averaging、composite voxel、diffuse-interface phase-field 和贴体网格参考模型在界面脱粘、基体裂纹和损伤路径预测上的差异，最后给出体素界面损伤模型的适用性地图。

这个 idea 的出发点很实际：编织复合材料的几何很复杂，贴体网格前处理成本高，体素模型又容易把 yarn/matrix 界面变成阶梯状边界。工程上真正需要的不是又一个漂亮裂纹图，而是一个清晰判断：

> 在什么几何、材料对比和网格分辨率下，便宜的体素模型可以放心用？什么时候必须上 composite voxel、扩散界面相场或贴体网格？

我把这个问题设计成 benchmark，而不是单纯宣称提出一个全新界面断裂模型。原因很直接：体素界面损伤、cohesive phase-field、composite voxel 和界面能量一致已有不少强工作。更有价值的路线，是把这些方法放进同一套 TexGen 几何和同一组误差指标里做对照，给出可复现的适用边界。

## 核心观点

这项研究的核心不是“我发明了一个完全没有前人的模型”，而是：

> 我提出一个面向编织复合材料的可复现评测框架，用同一组受控 TexGen 几何回答体素界面损伤模型的可信度问题。

具体来说，研究要回答三个问题：

| 问题 | 工程意义 | 预期输出 |
|---|---|---|
| hard voxel 的误差从哪里来？ | 体素模型便宜，但阶梯界面可能改变起裂位置 | 识别 `h/R_yarn`、界面角度、曲率和材料对比的影响 |
| 哪种界面修正最划算？ | stress averaging、composite voxel、扩散界面相场都能修正界面，但成本不同 | 比较峰值载荷、耗散能、裂纹路径和损伤模式误差 |
| 什么时候需要贴体参考？ | 不可能每个 RVE 都做高质量 conformal mesh | 给出实用 regime map，说明不同方法的适用区间 |

这类结果对做编织复合材料多尺度分析的人有直接价值。很多时候，研究者不是缺一个复杂模型，而是不知道一个自动体素 RVE 的结果能不能信。

## 实用性：为什么这个 idea 值得做

编织复合材料的 meso-scale 建模通常要处理 yarn 路径、截面变化、局部曲率、交织接触、纤维方向和基体薄层。TexGen/pytexgen 很适合生成这类参数化几何，也适合批量生成不同 weave、crimp、spacing 和 resolution 的 RVE。

但损伤分析比弹性均质化更敏感。硬体素标签会把真实曲线界面切成网格方向的小台阶，可能导致三类问题：

- 界面附近出现人工应力集中；
- 本该沿真实 yarn/matrix 界面扩展的脱粘，被体素面方向牵引；
- 两根 yarn 距离很近时，体素离散可能制造人工连接或错误的薄基体层。

这些问题不只是数值洁癖。它们会影响峰值强度、损伤起裂模式、刚度退化曲线和最终失效判断。对于多尺度设计而言，如果 meso-scale RVE 把界面脱粘误判成基体裂纹，宏观材料参数就会被错误标定。

因此，这个 benchmark 的实用目标很明确：

> 给出一套“体素界面损伤可信度检查表”，让研究者在选择 hard voxel、composite voxel、diffuse phase-field 或 conformal mesh 前有依据。

## 技术路线

我计划把研究流程拆成五层。

<figure class="paper-figure">
  <svg viewBox="0 0 980 390" role="img" aria-label="TexGen voxel interface damage benchmark workflow">
    <defs>
      <marker id="proposalArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
        <path d="M0,0 L0,6 L9,3 z" fill="#1b756f" />
      </marker>
    </defs>
    <rect x="22" y="24" width="936" height="342" rx="14" fill="none" stroke="#9b8d7f" stroke-opacity="0.45" />
    <g font-family="Inter, Arial, sans-serif" fill="currentColor">
      <rect x="46" y="78" width="172" height="122" rx="8" fill="#fffaf1" stroke="#b85b2b" />
      <text x="78" y="114" font-size="20">TexGen 几何</text>
      <text x="70" y="146" font-size="15">plain / twill / 3D weave</text>
      <text x="70" y="170" font-size="15">曲率与间距可控</text>
      <path d="M232 139 H286" stroke="#1b756f" stroke-width="5" marker-end="url(#proposalArrow)" />
      <rect x="302" y="58" width="190" height="162" rx="8" fill="#fffaf1" stroke="#1b756f" />
      <text x="342" y="94" font-size="20">体素模型组</text>
      <text x="326" y="126" font-size="15">hard voxel</text>
      <text x="326" y="150" font-size="15">stress averaging</text>
      <text x="326" y="174" font-size="15">composite voxel</text>
      <text x="326" y="198" font-size="15">diffuse PF-CZM</text>
      <path d="M506 139 H560" stroke="#1b756f" stroke-width="5" marker-end="url(#proposalArrow)" />
      <rect x="576" y="78" width="166" height="122" rx="8" fill="#fffaf1" stroke="#293f67" />
      <text x="614" y="114" font-size="20">参考解</text>
      <text x="604" y="146" font-size="15">贴体 cohesive mesh</text>
      <text x="604" y="170" font-size="15">或高分辨率基准</text>
      <path d="M756 139 H810" stroke="#1b756f" stroke-width="5" marker-end="url(#proposalArrow)" />
      <rect x="826" y="78" width="110" height="122" rx="8" fill="#fffaf1" stroke="#b85b2b" />
      <text x="850" y="114" font-size="20">地图</text>
      <text x="846" y="146" font-size="15">误差边界</text>
      <text x="846" y="170" font-size="15">适用区间</text>
      <rect x="214" y="266" width="552" height="52" rx="8" fill="#f4efe6" stroke="#9b8d7f" />
      <text x="254" y="298" font-size="17">目标：不是预设某个模型胜出，而是量化每类模型什么时候可信</text>
    </g>
  </svg>
  <figcaption>图 1. 研究路线：用 TexGen 生成受控几何，同步构造多种体素界面损伤模型和参考模型，再用统一误差指标输出适用性地图。</figcaption>
</figure>

第一层是几何生成。用 TexGen/pytexgen 生成斜界面、圆形 yarn 截面、双 yarn 近距离结构、plain weave 截面和小型 3D RVE。几何参数要可控，例如 yarn 半径、crimp、yarn 间距、界面角度和体积分数。

第二层是模型组。每个几何都至少生成四类体素模型：

- hard voxel CDM：最便宜的基线；
- stress averaging voxel：对应已有平滑应力修正思想；
- composite voxel：把含界面的体素看成局部 laminate 或 cohesive composite voxel；
- diffuse-interface phase-field：把 hard label 变成连续 `lambda(x)`，在界面带中演化界面损伤。

第三层是参考模型。小问题用贴体 cohesive mesh 或高分辨率收敛解作为参考；复杂 3D RVE 可以先用高分辨率体素 + composite voxel 作为近似参考。

第四层是误差指标。不能只看裂纹图，要输出峰值载荷、耗散能、裂纹路径距离、损伤模式分类和网格偏置指标。

第五层是 regime map。最终不是只说某个模型好，而是把误差和无量纲参数关联起来，例如 `h/R_yarn`、`l/h`、`G_i/G_b`、材料对比、界面角度和 yarn 间距。

## 技术支撑

这个 idea 不是空中楼阁。它有三类现成支撑。

第一类是几何和前处理支撑。TexGen 本身就是编织结构几何建模的重要工具，支持 textile geometry、voxel mesh export 和 tetrahedral volume mesh export。现有 `pytexgen` 路线又把 TexGen 的 Python 使用、体素化后端和 Abaqus 导出连接起来，这给 benchmark 的自动化生成提供了基础。

第二类是体素界面修正支撑。Fang 等已经指出 voxel-based textile composite 模型中的 artificial stress concentration 问题，并用 stress averaging 改善损伤预测。Zheng 等比较了 voxel 与 conformal discretization 在 3D woven damage simulation 中的差异，说明这个问题确实会影响损伤演化。Gelebart 与 Ouaki 的 material filtering、Kabel 等的 composite voxel、Chen 等的 FFT phase-field + cohesive composite voxel，则提供了更系统的亚体素界面处理技术。

第三类是相场和界面损伤支撑。Verhoosel 与 de Borst 的 cohesive phase-field、Paggi 与 Reinoso 的 crack-interface interaction、Nguyen 等的 regularized interfacial transition zone、Zhou 等的 interface-width-insensitive cohesive phase-field，以及后续 adaptive PF-CZM，都说明相场和 cohesive interface 的结合已经具备成熟理论基础。我的研究不需要从零发明整套断裂理论，而是把这些思想放进编织复合材料体素几何的评测场景。

这也是为什么我把论文定位成 benchmark 和适用性地图。已有文献越多，越说明需要一个能把这些路线放到同一个编织复合材料问题里的比较框架。

## 候选模型与预期作用

我不会预设 diffuse-interface phase-field 一定最好。相反，它只是候选模型之一。

| 模型 | 计算成本 | 优势 | 主要风险 |
|---|---:|---|---|
| hard voxel CDM | 低 | 实现简单，适合大规模 RVE 批处理 | 阶梯界面可能支配裂纹路径 |
| stress averaging voxel | 低到中 | 可缓解局部假应力峰值 | 更像场修正，不直接保证耗散能一致 |
| composite voxel cohesive | 中 | 有亚体素界面法向和 laminate/cohesive 解释 | 实现复杂，界面拓扑需要稳定重建 |
| diffuse-interface phase-field | 中到高 | 裂纹演化连续，适合复杂曲线界面和拓扑变化 | 参数较多，需要证明不只是平滑图像 |
| conformal cohesive mesh | 高 | 最接近几何真实界面 | 前处理成本高，不适合批量参数扫描 |

如果 diffuse-interface phase-field 最终没有明显优势，这个研究仍然成立。因为 benchmark 的价值在于告诉别人：在某些编织 RVE 中，composite voxel 已经足够，或者 hard voxel 在指定分辨率下可以接受。这样的结论同样实用。

## 可行性分析

我认为这项研究可行，原因有四点。

第一，几何可控。TexGen/pytexgen 可以生成参数化 weave，不需要依赖不可控实验 CT 图像。一开始只要做二维截面和小型 RVE，就能快速建立对照。

第二，模型可以逐步实现。第一阶段只需要 hard voxel、stress averaging 和一个简化 diffuse-interface phase-field，不必一次实现完整 composite voxel + frictional cohesive + 3D contact。等误差指标跑通后，再加入更强基线。

第三，验证指标明确。峰值载荷、耗散能、裂纹路径距离、damage mode confusion 和 mesh-bias index 都能自动计算，避免把评估建立在主观看图上。

第四，实验规模可控。最小实验不需要大型 3D 工程结构。斜界面、圆形 yarn 截面、双 yarn 接近和 plain weave 截面已经足够暴露体素界面误差。

## 最小可交付实验

第一版论文可以聚焦五个实验。

| 实验 | 几何 | 控制变量 | 要证明什么 |
|---|---|---|---|
| 斜直界面 | 两相材料界面穿过规则体素 | 界面角度、`h/l`、`G_i/G_b` | hard voxel 是否沿坐标轴偏置裂纹 |
| 圆形 yarn 截面 | 单 yarn / matrix 界面 | 曲率半径、材料对比、界面韧性 | 曲线界面的脱粘路径和耗散能误差 |
| 双 yarn 近距离 | 两根 yarn 中间有薄基体层 | yarn 间距、体素尺寸 | 是否出现 artificial connection |
| plain weave 截面 | 真实 TexGen 截面 | crimp、局部 yarn 方向、resolution | 起裂位置和损伤模式是否稳定 |
| 小型 3D RVE | 低分辨率 3D 编织单胞 | loading angle、periodic BC | 方法能否进入三维批量评估 |

如果这五组实验能给出清晰趋势，就足以支撑一篇方法评估型论文。后续再接 3D-woven cyclic tensile data 或更复杂实验，作为宏观曲线和刚度退化的外部验证。

## 预期贡献

这篇研究最终可以主张三类贡献。

第一，提出一个 **TexGen 驱动的编织复合材料体素界面损伤 benchmark**。它的价值是自动化、可复现、几何参数可控。

第二，建立一组面向损伤模拟的误差指标。不只比较宏观应力-应变曲线，还比较界面耗散能、裂纹路径距离、损伤模式分类和网格偏置。

第三，给出体素界面损伤模型的适用性地图。它回答的是工程上最常见的问题：某个 RVE 分辨率下，便宜模型能不能用？如果不能，应该升级到哪一级模型？

我认为这比单纯提出一个新界面相场公式更稳。因为即使某个候选模型表现不好，benchmark 本身仍然有研究价值。

## 创新边界

这项研究需要诚实处理已有工作。

已有 work 已经覆盖了很多单点技术：stress averaging、composite voxel、FFT phase-field、cohesive phase-field、interface-width-insensitive phase-field 和 adaptive PF-CZM。因此我不会把创新写成“首次提出体素界面相场断裂模型”。

更准确的创新边界是：

> 首次围绕 TexGen 生成的编织复合材料几何，建立一套面向体素界面损伤的多模型 benchmark 和适用性地图，把 hard voxel、stress averaging、composite voxel、diffuse-interface phase-field 与贴体参考放在同一组受控损伤问题中比较。

这条边界更可防守，也更符合文献现状。

## 风险与应对

第一个风险是 reference model 太贵。应对方式是分层参考：小问题用贴体 cohesive mesh，复杂 RVE 用高分辨率或 composite voxel 近似参考。

第二个风险是 diffuse phase-field 参数多。应对方式是把它作为候选模型，不预设优越性，并系统扫描 `l/h`、`eta/h` 和 `G_i/G_b`。

第三个风险是真实编织复合材料失效模式太多。第一篇只聚焦 yarn/matrix 界面脱粘、基体裂纹和早期损伤模式，fiber kinking、疲劳和复杂接触摩擦作为后续扩展。

第四个风险是 benchmark 做成工程报告而不是论文。应对方式是把误差指标和无量纲参数关系做清楚，形成可迁移的 regime map，而不是只罗列案例。

## 当前研究判断

我现在会这样向别人汇报这个 idea：

> 我不是试图再造一个孤立的体素断裂模型，而是要建立一套可复现的编织复合材料体素界面损伤评测平台。它的实用价值在于帮助研究者判断自动体素 RVE 的损伤预测是否可信；技术上可由 TexGen/pytexgen、Voxel-ACDM、composite voxel 和 phase-field cohesive fracture 共同支撑；论文产出可以是 benchmark、误差指标和适用性地图。

这条路线的好处是结果不怕被某个强基线否定。如果 hard voxel 足够好，那就是实用结论；如果 composite voxel 最稳，那就是最佳实践；如果 diffuse-interface phase-field 在复杂 yarn 几何中胜出，再进一步发展成新方法论文。

## 参考资料

- TexGen Scripting Guide v3.1. [PDF](https://usermanual.wiki/Pdf/TexGenScriptingGuidev31.938995685.pdf)
- Iarve, E. V., Mollenhauer, D., Zhou, E. G., Breitzman, T., Whitney, T. J. [Independent mesh method-based prediction of local and volume average fields in textile composites](https://doi.org/10.1016/j.compositesa.2009.04.034). *Composites Part A*, 40(12):1880-1890, 2009.
- Hsu, S.-Y., Cheng, R.-B. [Modeling geometry and progressive interfacial damage in textile composites](https://doi.org/10.1177/0021998312447207). *Journal of Composite Materials*, 47(11), 2013.
- Fang, G., El Said, B., Ivanov, D., Hallett, S. [Smoothing artificial stress concentrations in voxel-based models of textile composites](https://doi.org/10.1016/j.compositesa.2015.10.025). *Composites Part A*, 80:270-284, 2016.
- Wucher, B., Hallström, S., Dumas, D., Pardoen, T., Bailly, C., Martiny, P., Lani, F. [Nonconformal mesh-based finite element strategy for 3D textile composites](https://doi.org/10.1177/0021998316669875). *Journal of Composite Materials*, 2017.
- Zheng, T., Guo, L., Tang, Z., Wang, T., Li, Z. [Comparison of progressive damage simulation of 3D woven composites between voxel and conformal discretization models](https://doi.org/10.1016/j.mechmat.2021.103860). *Mechanics of Materials*, 158:103860, 2021.
- [Meso-scale progressive damage simulation of textile composites using mesh superposition](https://doi.org/10.1016/j.ijsolstr.2022.111987). *International Journal of Solids and Structures*, 256:111987, 2022.
- Gelebart, L., Ouaki, F. [Filtering material properties to improve FFT-based methods for numerical homogenization](https://doi.org/10.1016/j.jcp.2015.03.048). *Journal of Computational Physics*, 294:90-95, 2015.
- Kabel, M., Merkert, D., Schneider, M. [Use of composite voxels in FFT-based homogenization](https://doi.org/10.1016/j.cma.2015.06.003). *Computer Methods in Applied Mechanics and Engineering*, 294:168-188, 2015.
- Chen, Y., Gelebart, L., Marano, A., Marrow, J. [FFT phase-field model combined with cohesive composite voxels for fracture of composite materials with interfaces](https://doi.org/10.1007/s00466-021-02041-1). *Computational Mechanics*, 68:433-457, 2021.
- Verhoosel, C. V., de Borst, R. [A phase-field model for cohesive fracture](https://doi.org/10.1002/nme.4553). *International Journal for Numerical Methods in Engineering*, 96(1):43-62, 2013.
- Paggi, M., Reinoso, J. [Revisiting the problem of a crack impinging on an interface](https://doi.org/10.1016/j.cma.2017.04.004). *Computer Methods in Applied Mechanics and Engineering*, 321:145-172, 2017.
- Nguyen, T. T., Yvonnet, J., Bornert, M., Chateau, C., Sab, K., Romani, R., Le Roy, R. [Role of interfacial transition zone in phase field modeling of fracture in layered heterogeneous structures](https://doi.org/10.1016/j.jcp.2019.02.022). *Journal of Computational Physics*, 386:585-610, 2019.
- [Phase field modeling of interfacial damage in heterogeneous media with stiff and soft interphases](https://doi.org/10.1016/j.engfracmech.2019.106574). *Engineering Fracture Mechanics*, 218:106574, 2019.
- Zhou, Q. et al. [An interface-width-insensitive cohesive phase-field model for fracture evolution in heterogeneous materials](https://doi.org/10.1016/j.ijsolstr.2022.111980). *International Journal of Solids and Structures*, 256:111980, 2022.
- Bian, P., Qing, H. [A novel phase-field based cohesive zone model for modeling interfacial failure in composites](https://arxiv.org/abs/2102.10516). arXiv:2102.10516, 2021.
- Bian, P. et al. [A unified phase-field method-based framework for modeling quasi-brittle fracture in composites with interfacial debonding](https://doi.org/10.1016/j.compstruct.2023.117647). *Composite Structures*, 327:117647, 2024.
- Bian, P.-L. et al. [Adaptive phase-field cohesive-zone model for simulation of mixed-mode interfacial and bulk fracture in heterogeneous materials with directional energy decomposition](https://doi.org/10.1016/j.cma.2025.118062). *Computer Methods in Applied Mechanics and Engineering*, 443:118062, 2025.
- Chen, W.-X., Peng, X.-L., Wu, J.-Y., Furat, O., Schmidt, V., Xu, B.-X. [A length-scale insensitive cohesive phase-field interface model](https://arxiv.org/abs/2407.20259). arXiv:2407.20259, 2024.
- Liu, Y., Xu, H., He, C., Xia, J. [Phase field-peridynamics coupling method for interface mechanical properties of heterogeneous materials](https://doi.org/10.1016/j.compstruct.2025.118887). *Composite Structures*, 356:118887, 2025.
- Tian, T., Chen, C., He, L., Wei, H. [Adaptive finite element method for phase field fracture models based on recovery error estimates](https://doi.org/10.1016/j.cam.2025.116732). *Journal of Computational and Applied Mathematics*, 472:116732, 2026.
- Aranda, P., Segurado, J. [Effective toughness estimation by FFT based phase field fracture: Application to composites and polycrystals](https://doi.org/10.1016/j.mechrescom.2025.104498). *Mechanics Research Communications*, 2025.
- [Mesoscale analysis of the transverse cracking kinetics in woven composite laminates using a phase-field fracture theory](https://doi.org/10.1016/j.engfracmech.2019.106523). *Engineering Fracture Mechanics*, 216:106523, 2019.
- [An anisotropic cohesive phase field model for quasi-brittle fractures in thin fibre-reinforced composites](https://doi.org/10.1016/j.compstruct.2020.112635). *Composite Structures*, 252:112635, 2020.
- Oddy, C. [Macroscale Modelling of 3D-Woven Composites: Inelasticity, Progressive Damage and Final Failure](https://research.chalmers.se/en/publication/531616). Doctoral thesis, Chalmers University of Technology, 2022.
- [Cyclic behaviour of 3D-woven composites in tension: Experimental testing and macroscale modelling](https://doi.org/10.1016/j.compositesa.2024.108354). *Composites Part A*, 187:108354, 2024.
