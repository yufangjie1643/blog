---
title: 'TexGen Python 绑定与编织复合材料建模'
description: '介绍 pytexgen 项目：TexGen 的 Python 封装，用于纺织结构几何建模与有限元前处理。'
pubDate: 1746234000
slug: 'texgen-python-binding'
aliases: ['third-post']
category: '项目笔记'
series: '开源项目'
tags: ['编织复合材料', '几何建模', 'TexGen', 'Abaqus']
---

编织复合材料（Textile Composites）因其优异的损伤容限和可设计性，在航空航天领域应用广泛。我开发了 **pytexgen** —— TexGen 几何建模引擎的 Python 绑定，用于纺织结构的高效建模与有限元前处理。

## 功能特性

### 1. 几何建模
- **2D/3D 编织**：平纹、斜纹、缎纹及多层角联锁结构
- **参数化纱线路径**：基于样条曲线定义纱线中心线
- **横截面控制**：椭圆、矩形、透镜形等可定制截面

### 2. 网格生成
- **体素网格（Voxel Mesh）**：均匀体素化，适合谱方法或像素/体素型求解器
- **四面体网格（Tet Mesh）**：通过 CGAL 生成高质量非结构化网格
- **局部加密**：纱线交织区自动网格细化

### 3. 有限元接口
- **Abaqus**：生成 `.inp` 文件，包含部件、装配体、材料属性与边界条件模板
- **ANSYS**：导出 `.cdb` 网格文件

## 使用示例

```python
from pytexgen import Weave, Textile, MeshExporter

# 创建平纹织物
weave = Weave.plain_wearn(warp_count=10, weft_count=10)
textile = Textile.from_weave(weave, yarn_width=2.0, yarn_thickness=0.5)

# 生成体素网格
voxel_mesh = textile.voxelize(resolution=0.1)

# 导出到 Abaqus
exporter = MeshExporter(voxel_mesh)
exporter.to_abaqus("plain_weave.inp")
```

项目地址：[github.com/yufangjie1643/pytexgen](https://github.com/yufangjie1643/pytexgen)
