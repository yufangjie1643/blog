export interface TagMeta {
  name: string;
  label: string;
  description: string;
  group: string;
}

export const dailyPaperTag = '每日论文精读';

export const tagRegistry: TagMeta[] = [
  {
    name: dailyPaperTag,
    label: dailyPaperTag,
    description: '面向公开阅读的论文精读、技术脉络和相关工作梳理。',
    group: 'reading',
  },
  {
    name: '湍流',
    label: '湍流',
    description: '湍流模拟、统计结构、LES/DNS/RANS 相关内容。',
    group: 'mechanics',
  },
  {
    name: 'LES',
    label: 'LES',
    description: '大涡模拟、亚格子闭合和壁模型。',
    group: 'mechanics',
  },
  {
    name: '神经算子',
    label: '神经算子',
    description: 'Neural Operator、FNO、PINO 等算子学习方法。',
    group: 'machine-learning',
  },
  {
    name: 'PINO',
    label: 'PINO',
    description: '物理信息神经算子及 PDE 残差约束。',
    group: 'machine-learning',
  },
];

export const getTagMeta = (tag: string) =>
  tagRegistry.find((item) => item.name === tag);
