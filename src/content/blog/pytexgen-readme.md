---
title: 'pytexgen：TexGen Python 绑定与纺织复合材料建模'
description: '详细介绍 pytexgen 的功能特性、API 设计与使用示例。'
pubDate: '2025-05-05'
---

> 项目地址：[github.com/yufangjie1643/pytexgen](https://github.com/yufangjie1643/pytexgen)

pytexgen 是 **TexGen**（诺丁汉大学开发的开源几何纺织建模软件）的 Python 绑定，将 TexGen C++ 引擎的完整能力引入 Python 生态，支持脚本化的纺织结构创建、分析和有限元导出。

## 核心功能

- **全面的纺织建模**：2D 编织、3D 编织、角联锁、层间联锁、正交织物、针织和编织
- **剪切几何**：通过 `CShearedTextileWeave2D` 建模平面内剪切变形下的织物
- **灵活的纱线定义**：完全控制纱线路径（节点）、插值（三次、线性、贝塞尔）和横截面（椭圆、透镜形、矩形、多边形等）
- **网格生成**：矩形体素、剪切体素、交错体素、八叉树自适应体素、四面体（TetGen）和表面壳单元网格
- **FEA 导出**：直接导出 Abaqus（`.inp`）和 ANSYS 格式，支持周期性边界条件
- **跨平台**：为 Linux、macOS 和 Windows 提供预编译 wheel

## 安装

```bash
pip install pytexgen
```

Python 3.8+，无需编译器或 C++ 依赖。

## 使用示例

### 创建 2D 平纹织物

```python
from pytexgen import *

weave = CTextileWeave2D(4, 4, 5.0, 2.0, False)
weave.SwapPosition(0, 3)
weave.SwapPosition(1, 2)
weave.SwapPosition(2, 1)
weave.SwapPosition(3, 0)
weave.SetYarnWidths(4.0)
weave.SetYarnHeights(0.8)
weave.AssignDefaultDomain()

name = AddTextile(weave)
SaveToXML("plain_weave.tg3", name, OUTPUT_STANDARD)
```

### 剪切织物与体素网格导出

```python
import math
from pytexgen import *

shear_angle = math.radians(15)
textile = CShearedTextileWeave2D(2, 2, 1.0, 0.2, shear_angle, True, True)
textile.SwapPosition(1, 0)
textile.SwapPosition(0, 1)
textile.SetYarnWidths(0.8)
textile.SetYarnHeights(0.1)
textile.AssignDefaultDomain()

name = AddTextile(textile)

voxel = CRectangularVoxelMesh("CPeriodicBoundaries")
voxel.SaveVoxelMesh(textile, "sheared_weave.inp", 48, 48, 24, True, True, 5, 0)
```

### 3D 编织织物

```python
from pytexgen import *

textile = CTextileWeave3D(8, 4, 5.0, 7.0)
textile.AddYLayers(0, 1)
textile.AddYLayers(2, 1)
textile.AddYLayers(4, 1)
textile.AddYLayers(6, 1)
textile.AddXLayers()
textile.AddYLayers()
textile.AddXLayers()
textile.AddYLayers()
textile.AddXLayers()
textile.AddYLayers()

textile.PushUp(0, 0)
textile.PushUp(1, 0)
textile.PushDown(4, 0)
textile.PushUp(7, 0)

textile.SetYarnWidths(4.0)
textile.SetYarnHeights(1.0)
textile.AssignDefaultDomain()
AddTextile(textile)
```

## 导出格式

| 格式 | 方法 | 用途 |
|------|------|------|
| TexGen XML (`.tg3`) | `SaveToXML()` | 模型保存/加载 |
| Abaqus (`.inp`) | `SaveVoxelMesh()` / `SaveTetgenMesh()` | 有限元分析 |
| ANSYS | `pytexgen.Ansys` 模块 | ANSYS FEA |
| 表面网格 | `CSurfaceMesh` | 可视化、CFD |

## 许可证

GNU General Public License v2.0 or later。

学术引用：
> Lin, H., Brown, L.P. and Long, A.C. (2011). Modelling and Simulating Textile Structures using TexGen. *Advanced Materials Research*, Vols. 331, pp 44-47.
