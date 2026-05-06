---
title: 'SUTrack：面向简单且统一的多模态单目标跟踪'
description: '介绍 AAAI 2025 录用论文 SUTrack 的核心思想与性能表现。'
pubDate: 1746493200
slug: 'sutrack'
aliases: ['sutrack-readme']
category: '论文阅读'
series: '目标跟踪'
tags: ['目标跟踪', '计算机视觉', '深度学习']
---

> 论文：[SUTrack: Towards Simple and Unified Single Object Tracking](https://ojs.aaai.org/index.php/AAAI/article/view/32223) (AAAI 2025)
> 
> 项目地址：[github.com/yufangjie1643/SUTrack-moe](https://github.com/yufangjie1643/SUTrack-moe)

SUTrack 是一个简单而统一的单目标跟踪（SOT）框架，将五种 SOT 任务整合到一个统一的模型中，通过单次训练即可同时处理：

- **RGB-based Tracking**
- **RGB-Depth Tracking**
- **RGB-Thermal Tracking**
- **RGB-Event Tracking**
- **RGB-Language Tracking**

## 核心思想

SUTrack 将不同模态统一表示，并使用 Transformer 编码器进行特征学习与模板-搜索区域匹配。相比于为每种模态设计独立网络的做法，SUTrack 的架构更为简洁，参数量和训练成本显著降低。

## 性能表现

### RGB 跟踪

| Tracker | LaSOT (AUC) | GOT-10K (AO) | TrackingNet (AUC) |
|---------|-------------|--------------|-------------------|
| **SUTrack** | **75.2** | **81.5** | **87.7** |
| LoRAT | 75.1 | 77.5 | 85.6 |
| ODTrack | 74.0 | 78.2 | 86.1 |

### 多模态跟踪

| Tracker | LasHeR | RGBT234 | VOT-RGBD22 | DepthTrack | VisEvent | TNL2K |
|---------|--------|---------|------------|------------|----------|-------|
| **SUTrack** | **61.9** | **70.8** | **76.6** | **66.4** | **64.0** | **67.9** |
| SeqTrackv2 | 61.0 | 68.0 | 74.8 | 62.3 | 63.4 | 62.4 |

### 高效版本

SUTrack-T224 在 LaSOT 上达到 69.6 AUC，同时保持 CPU 23 FPS / AGX 34 FPS 的推理速度，适合边缘部署。

## 快速开始

```bash
conda create -n sutrack python=3.8
conda activate sutrack
bash install.sh
export PYTHONPATH=<absolute_path_of_SUTrack>:$PYTHONPATH
```

训练命令：
```bash
python -m torch.distributed.launch --nproc_per_node 4 \
  lib/train/run_training.py --script sutrack --config sutrack_b224_must --save_dir .
```

## 引用

```bibtex
@inproceedings{sutrack,
  title={SUTrack: Towards Simple and Unified Single Object Tracking},
  author={Chen, Xin and Kang, Ben and Geng, Wanting and Zhu, Jiawen and Liu, Yi and Wang, Dong and Lu, Huchuan},
  booktitle={AAAI},
  year={2025}
}
```
