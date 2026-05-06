---
title: 'SeismicSlope：边坡地震动力放大系数分析系统'
description: '详细介绍基于二维有限元模态叠加法的边坡地震响应分析桌面工具的设计思路与核心功能。'
pubDate: 1746320400
slug: 'seismic-slope'
aliases: ['bianpokangzheng-readme']
category: '项目笔记'
series: '工程分析工具'
tags: ['边坡工程', '地震响应', '有限元', 'Python']
---

> 项目地址：[github.com/yufangjie1643/bianpokangzheng](https://github.com/yufangjie1643/bianpokangzheng)

边坡地形对地震动具有显著的放大效应（topographic amplification effect）。当地震波传播至坡面、坡肩等不规则地形时，由于波的反射、折射和干涉，局部加速度峰值可远超自由场输入峰值。量化该效应的核心指标是**加速度放大系数**（Acceleration Amplification Factor, AAF），定义为边坡各点的峰值绝对加速度与输入基岩 PGA 之比。

## 技术路线

本项目采用以下技术路线对该问题进行数值模拟：

1. **有限元空间离散**：使用 CST（Constant Strain Triangle）单元对二维边坡域进行结构化三角剖分，组装全局刚度矩阵 **K** 和一致质量矩阵 **M**。

2. **模态分析**：对约束后的广义特征值问题 **K**φ = ω²**M**φ 使用 ARPACK 求解前 n 阶模态，获取固有频率 ω、质量归一化振型矩阵 Φ 以及 X/Y 双向模态参与系数 Γ。

3. **模态叠加时程积分**：将多自由度运动方程解耦为 n 个单自由度模态方程，使用 Newmark-β 隐式积分格式（β=1/4, γ=1/2，无条件稳定）推进时间步。

4. **响应重构**：通过 Φ·q̈ 将模态加速度叠加回物理坐标，得到各节点的绝对加速度时程，取其峰值合矢量与输入 PGA 之比即为放大系数。

## 功能特性

- 支持梯形、三角形、带缺口矩形三种参数化边坡几何
- 实时几何预览（SVG）
- 地震波文件导入（Excel / CSV），自动识别分隔符并绘制波形预览图
- 放大系数等值线云图 + 峰值加速度等值线云图
- 放大系数时程动画（GIF），支持逐帧/全局色标模式
- 向量化 Newmark-β 求解 + 多进程并行帧渲染
- 支持 Seed-Idriss 等效线性迭代与 Davidenkov 动剪切模量/阻尼曲线
- 支持左、右、底、顶边界的方向约束、弹簧、阻尼和摩擦接触参数
- pywebview 原生桌面界面，无需浏览器

## 快速开始

```bash
git clone https://github.com/yufangjie1643/bianpokangzheng.git
cd bianpokangzheng
pip install -r requirements.txt
python run_webui.py
```

核心参数说明：

| 参数 | 含义 | 默认值 |
|------|------|--------|
| E | 弹性模量 | 1×10¹⁰ Pa |
| nu | 泊松比 | 0.25 |
| rho | 密度 | 2200 kg/m³ |
| num_modes | 截断模态数 | 30 |
| zeta | 阻尼比 | 0.25 |

## 参考文献

1. Semblat, J. F., et al. (2003). Modal superposition method for the analysis of seismic wave amplification. *BSSA*, 93(3), 1144–1153.
2. Newmark, N. M. (1959). A method of computation for structural dynamics. *Journal of the Engineering Mechanics Division, ASCE*, 85(3), 67–94.
3. Chopra, A. K. (2020). *Dynamics of Structures: Theory and Applications to Earthquake Engineering* (5th ed.). Pearson.
