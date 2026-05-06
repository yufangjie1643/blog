---
title: 'Voxel-ACDM：复合材料损伤力学求解器'
description: '介绍基于体素的各向异性连续损伤力学求解器，用于复合材料多尺度渐进失效分析。'
pubDate: 1746061200
slug: 'voxel-acdm'
aliases: ['first-post']
category: '项目笔记'
series: '开源项目'
tags: ['复合材料', '损伤力学', '谱有限元', '多尺度分析']
featured: true
---

Voxel-ACDM 是我开发的一个基于体素的各向异性连续损伤力学（Anisotropic Continuum Damage Mechanics, ACDM）求解器，专注于复合材料的多尺度渐进失效模拟。

## 核心功能

- **体素化建模**：将复合材料细观结构离散为体素网格，直接基于 CT 扫描或人工生成的几何模型进行分析
- **谱有限元方法（Spectral FEM）**：利用 FFT 加速的谱方法高效求解周期性边界条件下的力学响应
- **各向异性损伤演化**：针对纤维、基体及界面相分别建立损伤准则与演化律
- **多尺度耦合**：从细观 Representative Volume Element（RVE）到宏观结构的多尺度传递

## 技术栈

```python
import numpy as np
from voxel_acdm import RVE, SpectralSolver

# 创建体素模型
rve = RVE.from_voxels(voxel_data, resolution=1.0)

# 定义载荷工况
loading = {'exx': 0.01, 'eyy': 0.0, 'ezz': 0.0}

# 运行谱有限元求解
solver = SpectralSolver(rve)
result = solver.solve(loading, damage_model='anisotropic_cdm')
```

项目地址：[github.com/yufangjie1643/Voxel-ACDM](https://github.com/yufangjie1643/Voxel-ACDM)
