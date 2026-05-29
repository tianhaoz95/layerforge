import type { Challenge } from '../types/challenge'

export interface TranslatedFields {
  title: string
  module: string
  description: string
  staticHint: string
}

export const challengeTranslations: Record<'zh', Record<string, TranslatedFields>> = {
  zh: {
    'linear-layer': {
      title: '线性层前向传播',
      module: 'Transformer 层',
      description: `实现线性（全连接）层的前向传播。

线性层的计算公式为：output = X @ W + b

其中：
  X  — 输入矩阵，形状为 (batch_size, in_features)
  W  — 权重矩阵，形状为 (in_features, out_features)
  b  — 偏置向量，形状为 (out_features,)

输出形状为 (batch_size, out_features)。

该操作是所有神经网络的基石。在 Transformer 中，线性层将 Token 嵌入投影到 Query、Key 和 Value 空间。

要求：
  • 仅使用 PyTorch。
  • 支持批次输入（X 中的多行）。
  • 返回一个 PyTorch 张量 (Tensor)。`,
      staticHint: `让我们一步步理清数学逻辑。

计算公式是：output = X @ W + b

在 PyTorch 中，@ 是矩阵乘法运算符。在相乘之前检查形状：
  - X 的形状是 (batch_size, in_features)
  - W 的形状是 (in_features, out_features)

它们的乘法顺序应该是怎样的，才能使形状兼容？

一旦你得到了 X @ W（形状为 batch_size × out_features），加上 b 就非常简单了 —— PyTorch 的广播机制 (broadcasting) 会自动处理每一行的加法。`
    },
    'relu-activation': {
      title: 'ReLU 激活函数',
      module: 'Transformer 层',
      description: `实现修正线性单元 (ReLU) 激活函数。

ReLU 的定义为：

  relu(x) = max(0, x)

应用于元素级：每个负值都变为 0，每个非负值保持不变。

ReLU 是深度学习中最广泛使用的非线性激活函数。在 Transformer 中，它出现在前馈子层中：FFN(x) = ReLU(x W1 + b1) W2 + b2

要求：
  • 输入可以是任意形状的 PyTorch 张量。
  • 输出必须与输入具有完全相同的形状。
  • 不得在原张量上进行就地 (in-place) 修改。
  • 仅使用 PyTorch。`,
      staticHint: `ReLU 其实比看起来更简单。你只需要把所有负数元素归零。

PyTorch 提供了几种优雅的实现方式：

1. torch.maximum(torch.tensor(0.0), x)  — 0 与每个元素之间的元素级最大值
2. torch.clamp(x, min=0.0)             — 将数值截断为至少为 0

两者都是单行代码。你觉得哪种方式更具可读性？

注意：确保你没有就地 (in-place) 修改原始张量 —— 请创建一个新张量或使用返回新张量的函数。`
    },
    'scaled-dot-product-attention': {
      title: '缩放点积注意力',
      module: 'Transformer 层',
      description: `实现缩放点积注意力 (Scaled Dot-Product Attention) —— 这是每个 Transformer 模型的核心操作。

计算公式为：

  Attention(Q, K, V) = softmax( Q K^T / √d_k ) V

其中：
  Q — 查询矩阵，形状为 (seq_len, d_k)
  K — 键矩阵，形状为 (seq_len, d_k)
  V — 值矩阵，形状为 (seq_len, d_v)

步骤：
  1. 计算原始注意力得分：scores = Q @ K.T
  2. 缩放：scores / sqrt(d_k)   (防止 softmax 中出现梯度消失)
  3. 对行应用 softmax 得到注意力权重（每行之和为 1）
  4. 值的加权和：weights @ V

系统提供了一个数值稳定的 softmax 函数 —— 请直接使用它。

要求：
  • 仅使用 PyTorch。
  • 输出形状必须为 (seq_len, d_v)。
  • 注意力权重矩阵的每行之和必须为 1.0。`,
      staticHint: `将公式拆分为四个明确的步骤：

  1. scores = Q @ K.T              # 形状: (seq_len, seq_len)
  2. scaled = scores / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))  # 其中 d_k = Q.shape[-1]
  3. weights = softmax(scaled)      # 使用系统提供的 softmax 函数
  4. output = weights @ V           # 形状: (seq_len, d_v)

系统提供的 softmax 函数已经处理了数值稳定性 —— 你不需要重新实现它，直接调用即可。

请在每一步检查张量的形状，以确保矩阵乘法是兼容的。`
    },
    'layer-normalization': {
      title: '层归一化',
      module: 'Transformer 层',
      description: `实现层归一化 (LayerNorm) —— 这是一种在整个 Transformer 架构中使用的关键稳定技术。

沿着最后一个维度应用的公式为：

  LayerNorm(x) = γ · (x − μ) / √(σ² + ε) + β

其中：
  μ  — 沿着最后一个轴的 x 的均值（按样本、按位置）
  σ² — 沿着最后一个轴 of x 的方差
  ε  — 用于数值稳定的微小常数（默认：1e-5）
  γ  — 形状为 (d_model,) 的可学习缩放参数
  β  — 形状为 (d_model,) 的可学习平移参数

与 BatchNorm（跨批次进行归一化）不同，LayerNorm 归一化单个样本内的特征。这使得它独立于批次大小，非常适合变长序列。

要求：
  • 沿着最后一个轴进行归一化 (dim = -1)。
  • 在计算均值和方差时使用 keepdim=True。
  • 输出与 x 具有相同的形状。
  • 仅使用 PyTorch。`,
      staticHint: `通过三个步骤来实现该公式：

  1. 沿着最后一个轴计算均值 and 方差：
       mean = torch.mean(x, dim=-1, keepdim=True)
       var  = torch.var(x,  dim=-1, keepdim=True, unbiased=False)

     keepdim=True 非常关键 —— 它能保持维度形状，从而让与 x 的广播机制 (broadcasting) 正常工作。

  2. 归一化：
       x_norm = (x - mean) / torch.sqrt(var + eps)

  3. 缩放与平移：
       return gamma * x_norm + beta

     gamma 和 beta 的形状为 (d_model,)，会自动与 x_norm 的最后一个维度进行正确的广播相乘/相加。`
    }
  }
}

export function getChallengeWithI18n(
  challenge: Challenge,
  lang: 'en' | 'zh'
): Challenge {
  if (lang === 'zh' && challengeTranslations.zh[challenge.id]) {
    const trans = challengeTranslations.zh[challenge.id]
    return {
      ...challenge,
      title: trans.title,
      module: trans.module,
      description: trans.description,
      staticHint: trans.staticHint,
    }
  }
  return challenge
}

