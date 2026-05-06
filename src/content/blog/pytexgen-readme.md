---
title: 'pytexgen：面向跨平台 wheel 的 TexGen Python 封装'
description: '按 pytexgen test 分支重新阅读源码后，对 1.1.0 的跨平台构建、NumPy/Torch 体素化后端、OpenMP 可选化和测试脚本的梳理。'
pubDate: 1746406800
updatedDate: 1777978213
sourceCheckedAt: 1777978213
slug: 'pytexgen'
aliases: ['pytexgen-readme']
category: '项目笔记'
series: '开源项目'
tags: ['编织复合材料', '几何建模', 'TexGen', 'Abaqus', '跨平台构建']
featured: true
---

> 项目地址：[github.com/yufangjie1643/pytexgen](https://github.com/yufangjie1643/pytexgen)  
> 阅读版本：`test` 分支，提交 `4ffe6b1`，2026-05-05 16:48:23 +0800。  
> 代码版本：`pyproject.toml` 中为 `1.1.0`。

这次重读要先修正一个判断：`test` 分支的重点不是简单地把 TexGen 包成 Python 库，也不是默认打开 OpenMP 做 C++ 并行。它真正解决的是 **跨平台 wheel 构建的可靠性**，并把体素化中容易受编译器、OpenMP runtime、p4est 和 SWIG 影响的部分，拆出了一条 NumPy/Torch 的 Python 后端路径。

换句话说，pytexgen 现在更像两层工程：

- 底层仍然是 TexGen C++ Core，通过 SWIG 生成 Python 绑定。
- 新增的 Python 体素化后端负责把已构建好的 `CTextile` 几何快照转成结构化体素或轻量自适应体素网格，再写出 Abaqus `.inp`。

这个方向很务实。科研用户最怕的不是少一个理论上更快的编译选项，而是在 Windows、macOS arm64、Linux aarch64 或旧 CPU 上装不上包。`test` 分支的优化就是优先保证默认安装路径稳定，然后把高风险依赖变成显式可选项。

## 这次改动的主线

从 README、`pyproject.toml`、`CMakeLists.txt`、`TexGen/gpu_voxelizer.py` 和测试脚本看，`test` 分支主要做了五件事。

| 方向 | 代码里的做法 | 对用户的意义 |
|------|--------------|--------------|
| 跨平台 wheel | 使用 `scikit-build-core` 和 `cibuildwheel`，覆盖 CPython 3.9 到 3.14 | pip 安装更接近普通 Python 包 |
| 降低构建依赖 | 提交生成好的 `Python/Core.py` 和 `Python/Core_wrap.cxx` | 普通构建不要求本地安装 SWIG |
| 避免默认 OpenMP 风险 | `TEXGEN_ENABLE_OPENMP=OFF` | 不再把 OpenMP runtime 当成 wheel 默认前提 |
| 避免本机指令集风险 | `TEXGEN_ENABLE_NATIVE_OPTIMIZATIONS=OFF` | 不默认使用 `-march=native`，减少旧 CPU 或交叉构建问题 |
| Python 体素化后端 | `pytexgen.gpu_voxelizer.voxelize_textile(...)` 支持 NumPy/Torch | 体素分类可以不依赖 C++ OpenMP 并行路径 |

这里的关键是：OpenMP 没有被彻底删除，它只是从默认路径移到了可选路径。CMake 里仍保留：

```text
TEXGEN_ENABLE_OPENMP=OFF
TEXGEN_ENABLE_NATIVE_OPTIMIZATIONS=OFF
TEXGEN_REGENERATE_SWIG=OFF
```

需要本地调优的人仍可以显式打开这些开关；面向 PyPI wheel 的默认构建则保持保守。

## 安装路径

基础安装现在只依赖 NumPy：

```bash
pip install pytexgen
```

如果要走 Torch 后端，再安装可选扩展：

```bash
pip install "pytexgen[gpu]"
```

README 里也提醒得很清楚：CUDA 用户应该先按自己驱动和 CUDA 版本安装匹配的 PyTorch，再安装 `pytexgen[gpu]`。这是正确的取舍，因为 PyTorch 的 CUDA wheel 本身就和平台、驱动、Python 版本强相关，不适合让 pytexgen 去替用户猜。

## 体素化后端

`test` 分支最值得写进文章的是 `TexGen/gpu_voxelizer.py`。文件名里有 `gpu`，但它并不是只面向 GPU；更准确的理解是：它提供了一个 **OpenMP-free 的 Python 体素化旁路**。

它的公开入口是：

```python
from pytexgen.gpu_voxelizer import voxelize_textile

result = voxelize_textile(
    textile,
    "plain_weave_voxels.inp",
    resolution=(64, 64, 32),
    backend="numpy",
)
```

如果机器上有合适的 Torch 设备，也可以写成：

```python
result = voxelize_textile(
    textile,
    "plain_weave_voxels.inp",
    resolution=(128, 128, 64),
    backend="torch",
    device="cuda",
)
```

代码逻辑大致是：

1. 从 `CTextile` 中抽取每根 yarn 的 slave node frame、截面多边形和 domain AABB。
2. 生成规则体素中心点。
3. 用 yarn 的局部坐标和截面多边形判断体素中心是否落入纱线内部。
4. 写出与 TexGen 体素网格风格兼容的 Abaqus C3D8R `.inp`。

这条路径的价值不是替代 TexGen C++ Core，而是把最容易因为 OpenMP、编译器 ABI 和平台差异出问题的一段分类计算，移动到 Python 数组计算生态里。

## NumPy 与 Torch 的分工

后端选择不是简单的“GPU 一定更快”。

| 后端 | 使用方式 | 适合场景 |
|------|----------|----------|
| C++ rectangular | `CRectangularVoxelMesh.SaveVoxelMesh(...)` | 继续使用 TexGen 原生规则体素导出 |
| NumPy | `voxelize_textile(..., backend="numpy")` | 默认可移植 CPU 路径，不需要 OpenMP runtime |
| Torch | `voxelize_textile(..., backend="torch")` | 大网格、CUDA/MPS 或已有 Torch 环境 |
| Adaptive NumPy | `voxelize_textile(..., adaptive=True)` | 轻量自适应体素探索，不依赖 p4est |
| p4est octree | 本地启用 p4est/sc 后构建 | 需要完整八叉树网格能力的本地高级构建 |

`backend="auto"` 的策略也比较保守：只有显式给了设备，或者 Torch 能检测到 CUDA/MPS 这类加速器时，才会自动选 Torch；否则会回到 NumPy。这个策略避免了小网格在 Torch 初始化和数据搬运上反而变慢。

NumPy 后端还做了保守的多线程控制。它不是依赖 C++ OpenMP，而是在 Python 层按 chunk 划分体素，并控制 worker 数量。这样能获得一定并行收益，同时不把 OpenMP runtime 变成安装包默认依赖。

## AABB 剪枝

`gpu_voxelizer.py` 里默认启用了 yarn AABB candidate pruning。它的意思是：每批体素中心先和每根 yarn 的包围盒做粗筛，只对可能相交的 yarn 继续做截面判断。

这个优化很适合纺织结构。因为任意一个体素中心通常只会靠近少数 yarn，如果每个体素都测试所有 yarn，计算量会随 yarn 数和分辨率快速膨胀。

项目里也没有只停留在想法层面。`test_gpu_voxelizer_backends.py` 中专门检查了剪枝和不剪枝的分类结果一致：

```text
test_numpy_aabb_pruning_matches_unpruned
```

这说明 AABB 剪枝在当前实现里被当作等价加速，而不是改变分类语义的近似技巧。

## 自适应体素路径

`adaptive=True` 是另一个重要但需要谨慎描述的点。它不是完整替代 p4est 的八叉树网格系统，而是一个轻量的 NumPy 自适应输出：

- 对体素中心和角点进行采样。
- 当采样结果不一致时继续细分。
- 最终把 leaf cell 写成非均匀 C3D8R 单元。

代码和文档都明确说明了限制：它没有 p4est 的 2:1 balancing，也没有处理 hanging-node 约束。因此它适合做边界附近的轻量细化探索，不能直接等价于完整自适应有限元网格生成器。

这点很重要。文章如果把 adaptive 模式写成“替代 p4est 的完整八叉树后端”，就是过度承诺。

## 构建配置为什么这样改

`CMakeLists.txt` 的默认值现在非常保守：

```text
TEXGEN_ENABLE_RENDERER=OFF
TEXGEN_ENABLE_GUI=OFF
TEXGEN_BUILD_EXAMPLES=OFF
TEXGEN_BUILD_UNIT_TESTS=OFF
TEXGEN_ENABLE_CASCADE=OFF
TEXGEN_ENABLE_DOCS=OFF
TEXGEN_ENABLE_PROFILE=OFF
TEXGEN_ENABLE_OPENMP=OFF
TEXGEN_ENABLE_NATIVE_OPTIMIZATIONS=OFF
TEXGEN_REGENERATE_SWIG=OFF
```

这个配置不是为了让本地源码构建的功能最多，而是为了让 wheel 的失败面最小：

- GUI 和 renderer 往往牵涉更多图形依赖，不适合默认 wheel。
- p4est/sc 在不同平台上的构建成本更高，所以普通 wheel 不暴露 `COctreeVoxelMesh`。
- OpenMP 在 MSVC、MinGW、macOS clang、Linux manylinux 之间的 runtime 行为差异很大，默认关闭更稳。
- `-march=native` 对本机性能有帮助，但对发布 wheel 是风险项，因为 wheel 可能被安装到另一台 CPU 上。
- SWIG regeneration 改为可选后，普通用户不需要为生成绑定文件准备 SWIG。

这是一组典型的“发布包优先”工程决策。源码用户仍能打开功能开关，pip 用户则先获得稳定安装。

## 测试与基准脚本

我这次重点读了三个脚本。

`test_gpu_voxelizer_backends.py` 不依赖真实 TexGen 几何，而是 stub 掉 Core 并 patch `extract_snapshots`。这样可以稳定测试 Python 后端本身，包括：

- NumPy 结构化体素公开路径。
- AABB 剪枝与不剪枝的一致性。
- NumPy adaptive 路径。
- Torch 可用时的 Torch 路径。
- Torch 不可用时的错误提示。
- adaptive 模式拒绝 Torch 后端。

`test_gpu_voxelizer.py` 则使用真实的 `CShearedTextileWeave2D` 做 smoke test，验证 Python NumPy 路径能围绕实际 TexGen textile 工作，并和 TexGen CPU voxelizer 路线形成对照。

`bench_gpu_voxelizer_backends.py` 是合成基准脚本，用来比较 NumPy 开启/关闭 AABB 剪枝，以及可选的 Torch CPU/GPU。这个脚本没有把 benchmark 伪装成论文结论，只是提供了可复现实验入口，这样比较合适。

## 使用建议

如果只是想在 Python 里生成 TexGen 几何并导出常规体素网格，仍然可以继续使用原生 C++ voxelizer：

```python
from pytexgen import CRectangularVoxelMesh

vox = CRectangularVoxelMesh("CPeriodicBoundaries")
vox.SaveVoxelMesh(textile, "voxels.inp", 64, 64, 32, True, True, 5, 0)
```

如果目标是跨平台批处理，尤其是在 CI、Windows 机器、macOS arm64 或没有稳定 OpenMP 工具链的环境里，我会优先试 NumPy 后端：

```python
from pytexgen.gpu_voxelizer import voxelize_textile

voxelize_textile(
    textile,
    "voxels_numpy.inp",
    resolution=(64, 64, 32),
    backend="numpy",
    aabb_pruning=True,
)
```

如果分辨率很高，并且已经有可用的 CUDA 或 MPS，再考虑 Torch：

```python
voxelize_textile(
    textile,
    "voxels_torch.inp",
    resolution=(160, 160, 80),
    backend="torch",
    device="cuda",
)
```

如果只是想在边界附近做细化探索，可以用 adaptive NumPy，但不要把它当成完整 p4est 替代：

```python
voxelize_textile(
    textile,
    "voxels_adaptive.inp",
    resolution=(32, 32, 16),
    backend="numpy",
    adaptive=True,
    adaptive_levels=2,
)
```

## 小结

按 `test` 分支重新看，pytexgen 1.1.0 的核心价值是把 TexGen 的 Python 分发做得更稳。它没有把 OpenMP 当成默认加速前提，而是通过 NumPy/Torch 后端把体素分类迁移到更容易跨平台运行的 Python 数组生态中。

这对编织复合材料仿真工作流很有意义：建模仍由 TexGen Core 保证，安装和批处理则尽量贴近普通 Python 包。对大多数用户来说，先能稳定安装、稳定导出 `.inp`，比默认打开所有 C++ 高级依赖更重要。

后续如果继续打磨，我会优先关注三点：把 `gpu_voxelizer` 的命名改得更贴近“NumPy/Torch voxel backend”，补充真实 textile 的性能基准，并在文档里更明确区分 C++ rectangular、Python NumPy、Python Torch、adaptive NumPy 和 p4est octree 这几条路线。
