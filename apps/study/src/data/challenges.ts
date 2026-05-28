import type { Challenge } from '../types/challenge'
import { PRoPEVisualization } from '../visualizations/PRoPEVisualization'

export const challenges: Challenge[] = [
  {
    id: 'linear-layer',
    title: 'Linear Layer Forward Pass',
    module: 'Transformer Layers',
    difficulty: 'beginner',
    language: 'python',
    tags: ['torch', 'linear algebra', 'forward pass'],
    description: `Implement the forward pass of a linear (fully-connected) layer.

A linear layer computes: output = X @ W + b

Where:
  X  — input matrix  of shape (batch_size, in_features)
  W  — weight matrix of shape (in_features, out_features)
  b  — bias vector   of shape (out_features,)

The output has shape (batch_size, out_features).

This operation is the backbone of every neural network. In a transformer,
linear layers project token embeddings into query, key, and value spaces.

Requirements:
  • Use only PyTorch.
  • Handle batched inputs (multiple rows in X).
  • Return a PyTorch Tensor.`,

    staticHint: `Think through the math step by step.

The formula is: output = X @ W + b

In PyTorch, @ is the matrix multiplication operator. Check the shapes before you multiply:
  - X is (batch_size, in_features)
  - W is (in_features, out_features)

Which order must they appear in the multiplication for the shapes to be compatible?

Once you have X @ W (shape: batch_size × out_features), adding b is straightforward — PyTorch broadcasting handles the per-row addition automatically.`,

    starterCode: `import torch


def linear_forward(X: torch.Tensor, W: torch.Tensor, b: torch.Tensor) -> torch.Tensor:
    """
    Forward pass of a linear layer: output = X @ W + b

    Args:
        X: Input matrix of shape (batch_size, in_features)
        W: Weight matrix of shape (in_features, out_features)
        b: Bias vector of shape (out_features,)

    Returns:
        Output matrix of shape (batch_size, out_features)
    """
    # YOUR CODE HERE
    pass


# ── Test harness (do not modify below this line) ───────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(42)

    # Test 1: basic forward pass
    X = torch.tensor([[1.0, 2.0, 3.0],
                      [4.0, 5.0, 6.0]])
    W = torch.tensor([[0.1, 0.2],
                      [0.3, 0.4],
                      [0.5, 0.6]])
    b = torch.tensor([0.1, 0.2])

    out = linear_forward(X, W, b)

    assert out is not None, "linear_forward returned None — did you forget to return?"
    assert isinstance(out, torch.Tensor), f"Expected torch.Tensor, got {type(out)}"
    assert out.shape == (2, 2), f"Shape mismatch: expected (2, 2), got {out.shape}"

    expected = torch.tensor([[2.3, 3.0],
                             [5.0, 6.6]])
    assert torch.allclose(out, expected, atol=1e-5), (
        f"Values incorrect.\\nGot:\\n{out}\\nExpected:\\n{expected}"
    )

    # Test 2: single sample
    X2 = torch.ones((1, 4))
    W2 = torch.eye(4)
    b2 = torch.zeros(4)
    out2 = linear_forward(X2, W2, b2)
    assert out2.shape == (1, 4), f"Shape mismatch for single sample: {out2.shape}"
    assert torch.allclose(out2, torch.ones((1, 4))), "Identity weight + zero bias should return input unchanged"

    # Test 3: bias shift
    X3 = torch.zeros((3, 2))
    W3 = torch.zeros((2, 5))
    b3 = torch.full((5,), 7.0)
    out3 = linear_forward(X3, W3, b3)
    assert torch.allclose(out3, torch.tensor(7.0)), "Zero input + zero weights should output the bias value"

    print("All tests passed!")
    print(f"Output shape: {out.shape}")
    print(f"Output:\\n{out}")
`,
  },

  {
    id: 'relu-activation',
    title: 'ReLU Activation',
    module: 'Transformer Layers',
    difficulty: 'beginner',
    language: 'python',
    tags: ['torch', 'activation function', 'non-linearity'],
    description: `Implement the Rectified Linear Unit (ReLU) activation function.

ReLU is defined as:

  relu(x) = max(0, x)

Applied element-wise: every negative value becomes 0, every non-negative
value is unchanged.

ReLU is the most widely used non-linearity in deep learning. In transformers
it appears in the feed-forward sublayer: FFN(x) = ReLU(x W1 + b1) W2 + b2

Requirements:
  • Input can be any shape PyTorch Tensor.
  • Output must have exactly the same shape as the input.
  • No in-place modification of the input tensor.
  • Use only PyTorch.`,

    staticHint: `ReLU is simpler than it looks. You need to zero out every negative element.

PyTorch gives you a few clean ways to do this:

1. torch.maximum(torch.tensor(0.0), x)  — element-wise max between 0 and each value
2. torch.clamp(x, min=0.0)             — clamp values to be at least 0

Both are one-liners. Which approach feels more readable to you?

Note: make sure you're not modifying the original tensor in-place —
create a new tensor or use a function that returns a new one.`,

    starterCode: `import torch


def relu(x: torch.Tensor) -> torch.Tensor:
    """
    Rectified Linear Unit activation: relu(x) = max(0, x)

    Applied element-wise. Negative values become 0; non-negatives
    are unchanged.

    Args:
        x: Input tensor of any shape.

    Returns:
        Tensor of the same shape with negative values zeroed out.
    """
    # YOUR CODE HERE
    pass


# ── Test harness (do not modify below this line) ───────────────────────────────

if __name__ == "__main__":
    # Test 1: basic 1-D case
    x1 = torch.tensor([-3.0, -1.0, 0.0, 1.0, 3.0])
    out1 = relu(x1)
    expected1 = torch.tensor([0.0, 0.0, 0.0, 1.0, 3.0])

    assert out1 is not None, "relu returned None — did you forget to return?"
    assert out1.shape == x1.shape, f"Shape must be preserved: expected {x1.shape}, got {out1.shape}"
    assert torch.allclose(out1, expected1), f"1-D test failed.\\nGot:      {out1}\\nExpected: {expected1}"

    # Test 2: 2-D array
    x2 = torch.tensor([[-1.0,  2.0],
                       [ 3.0, -4.0]])
    out2 = relu(x2)
    expected2 = torch.tensor([[0.0, 2.0],
                              [3.0, 0.0]])
    assert out2.shape == x2.shape, "Shape must be preserved for 2-D input"
    assert torch.allclose(out2, expected2), f"2-D test failed.\\nGot:\\n{out2}\\nExpected:\\n{expected2}"

    # Test 3: all-negative
    x3 = torch.tensor([-5.0, -0.001, -100.0])
    out3 = relu(x3)
    assert torch.all(out3 == 0.0), "All-negative input should produce all-zero output"

    # Test 4: no in-place mutation of input
    x4 = torch.tensor([-1.0, 2.0, -3.0])
    x4_copy = x4.clone()
    _ = relu(x4)
    assert torch.allclose(x4, x4_copy), "relu must not modify the input array in-place"

    print("All tests passed!")
    print(f"relu([-3, -1, 0, 1, 3]) = {out1}")
`,
  },

  {
    id: 'scaled-dot-product-attention',
    title: 'Scaled Dot-Product Attention',
    module: 'Transformer Layers',
    difficulty: 'intermediate',
    language: 'python',
    tags: ['torch', 'attention', 'transformer', 'softmax'],
    description: `Implement scaled dot-product attention — the core operation of every
transformer model.

The formula is:

  Attention(Q, K, V) = softmax( Q K^T / √d_k ) V

Where:
  Q — Query matrix  of shape (seq_len, d_k)
  K — Key matrix    of shape (seq_len, d_k)
  V — Value matrix  of shape (seq_len, d_v)

Steps:
  1. Compute raw attention scores: scores = Q @ K.T
  2. Scale: scores / sqrt(d_k)   (prevents vanishing gradients in softmax)
  3. Apply softmax row-wise to get attention weights (each row sums to 1)
  4. Weighted sum of values: weights @ V

A numerically stable softmax is provided — use it.

Requirements:
  • Use only PyTorch.
  • Output shape must be (seq_len, d_v).
  • Each row of the attention weight matrix must sum to 1.0.`,

    staticHint: `Break the formula into four explicit steps:

  1. scores = Q @ K.T              # shape: (seq_len, seq_len)
  2. scaled = scores / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))  # where d_k = Q.shape[-1]
  3. weights = softmax(scaled)      # use the provided softmax function
  4. output = weights @ V           # shape: (seq_len, d_v)

The provided softmax function already handles numerical stability — you
don't need to reimplement it, just call it.

Check your shapes at each step to make sure the matrix multiplications
are compatible.`,

    starterCode: `import torch


def softmax(x: torch.Tensor, dim: int = -1) -> torch.Tensor:
    """Numerically stable softmax. Provided — do not modify."""
    x_max = torch.max(x, dim=dim, keepdim=True).values
    e_x = torch.exp(x - x_max)
    return e_x / torch.sum(e_x, dim=dim, keepdim=True)


def scaled_dot_product_attention(
    Q: torch.Tensor, K: torch.Tensor, V: torch.Tensor
) -> torch.Tensor:
    """
    Scaled dot-product attention.

    Attention(Q, K, V) = softmax(Q @ K^T / sqrt(d_k)) @ V

    Args:
        Q: Query matrix  of shape (seq_len, d_k)
        K: Key matrix    of shape (seq_len, d_k)
        V: Value matrix  of shape (seq_len, d_v)

    Returns:
        Output of shape (seq_len, d_v)
    """
    # YOUR CODE HERE
    pass


# ── Test harness (do not modify below this line) ───────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(0)

    seq_len, d_k, d_v = 4, 8, 8

    Q = torch.randn(seq_len, d_k)
    K = torch.randn(seq_len, d_k)
    V = torch.randn(seq_len, d_v)

    out = scaled_dot_product_attention(Q, K, V)

    assert out is not None, "Function returned None — did you forget to return?"
    assert out.shape == (seq_len, d_v), (
        f"Output shape wrong: expected ({seq_len}, {d_v}), got {out.shape}"
    )

    # Verify against reference implementation
    scores = Q @ K.T / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))
    weights = softmax(scores)
    expected = weights @ V
    assert torch.allclose(out, expected, atol=1e-6), (
        f"Output does not match reference.\\nMax diff: {torch.max(torch.abs(out - expected)):.2e}"
    )

    # Attention weights must sum to 1 per query
    computed_weights = softmax(Q @ K.T / torch.sqrt(torch.tensor(d_k, dtype=torch.float32)))
    row_sums = computed_weights.sum(dim=-1)
    assert torch.allclose(row_sums, torch.ones(seq_len), atol=1e-6), (
        f"Attention weights must sum to 1 per row.\\nGot: {row_sums}"
    )

    # Verify scaling: unscaled scores should have higher variance
    unscaled_scores = Q @ K.T
    scaled_scores = unscaled_scores / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))
    assert scaled_scores.std() < unscaled_scores.std(), "Scaling should reduce score variance"

    print("All tests passed!")
    print(f"Output shape: {out.shape}")
    print(f"Attention weights (first query, rounded):")
    print(f"  {torch.round(computed_weights[0] * 1000) / 1000}")
    print(f"  (sum = {computed_weights[0].sum():.6f})")
`,
  },

  {
    id: 'layer-normalization',
    title: 'Layer Normalization',
    module: 'Transformer Layers',
    difficulty: 'intermediate',
    language: 'python',
    tags: ['torch', 'normalization', 'transformer', 'training stability'],
    description: `Implement Layer Normalization (LayerNorm), a critical stabilisation
technique used throughout transformer architectures.

The formula, applied along the last dimension:

  LayerNorm(x) = γ · (x − μ) / √(σ² + ε) + β

Where:
  μ  — mean of x along the last axis (per sample, per position)
  σ² — variance of x along the last axis
  ε  — small constant for numerical stability (default: 1e-5)
  γ  — learned scale parameter of shape (d_model,)
  β  — learned shift parameter of shape (d_model,)

Unlike BatchNorm (which normalises across the batch), LayerNorm normalises
across features within a single example. This makes it independent of batch
size and suitable for variable-length sequences.

Requirements:
  • Normalise along the last axis (dim = -1).
  • Use keepdim=True when computing mean and variance.
  • Output has the same shape as x.
  • Use only PyTorch.`,

    staticHint: `Work through the formula in three steps:

  1. Compute mean and variance along the last axis:
       mean = torch.mean(x, dim=-1, keepdim=True)
       var  = torch.var(x,  dim=-1, keepdim=True, unbiased=False)

     keepdim=True is essential — it preserves the shape so broadcasting
     with x works correctly.

  2. Normalise:
       x_norm = (x - mean) / torch.sqrt(var + eps)

  3. Scale and shift:
       return gamma * x_norm + beta

     gamma and beta have shape (d_model,) and will broadcast correctly
     against x_norm's last dimension.`,

    starterCode: `import torch


def layer_norm(
    x: torch.Tensor,
    gamma: torch.Tensor,
    beta: torch.Tensor,
    eps: float = 1e-5,
) -> torch.Tensor:
    """
    Layer Normalization over the last dimension.

    LayerNorm(x) = gamma * (x - mean) / sqrt(var + eps) + beta

    Args:
        x:     Input tensor. Common shapes: (batch, d_model) or (batch, seq, d_model).
        gamma: Scale parameter of shape (d_model,).
        beta:  Shift parameter of shape (d_model,).
        eps:   Numerical stability constant.

    Returns:
        Normalized tensor of the same shape as x.
    """
    # YOUR CODE HERE
    pass


# ── Test harness (do not modify below this line) ───────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(42)
    d_model = 4

    # Test 1: identity params (gamma=1, beta=0) → mean≈0, std≈1 per sample
    x1 = torch.tensor([[1.0, 2.0, 3.0, 4.0],
                       [4.0, 3.0, 2.0, 1.0]])
    gamma1 = torch.ones(d_model)
    beta1 = torch.zeros(d_model)

    out1 = layer_norm(x1, gamma1, beta1)

    assert out1 is not None, "Function returned None — did you forget to return?"
    assert out1.shape == x1.shape, f"Shape mismatch: expected {x1.shape}, got {out1.shape}"

    means = out1.mean(dim=-1)
    stds  = out1.std(dim=-1, unbiased=False)
    assert torch.allclose(means, torch.tensor(0.0), atol=1e-5), (
        f"Normalised means should be ~0. Got: {means}"
    )
    assert torch.allclose(stds, torch.tensor(1.0), atol=1e-5), (
        f"Normalised stds should be ~1. Got: {stds}"
    )

    # Test 2: gamma=2, beta=1 → mean should be ~beta mean, std ~gamma
    gamma2 = torch.full((d_model,), 2.0)
    beta2  = torch.full((d_model,), 1.0)
    out2 = layer_norm(x1, gamma2, beta2)
    assert torch.allclose(out2.mean(dim=-1), torch.tensor(1.0), atol=1e-5), (
        "With uniform gamma and beta, row mean should equal beta value"
    )

    # Test 3: 3-D input (batch, seq, d_model)
    x3 = torch.randn(2, 5, d_model)
    out3 = layer_norm(x3, gamma1, beta1)
    assert out3.shape == x3.shape, "Shape must be preserved for 3-D input"
    means3 = out3.mean(dim=-1)
    assert torch.allclose(means3, torch.tensor(0.0), atol=1e-5), "3-D: per-position means should be ~0"

    # Test 4: constant input — all same value, variance=0, eps should prevent NaN
    x4 = torch.full((2, d_model), 5.0)
    out4 = layer_norm(x4, gamma1, beta1)
    assert not torch.any(torch.isnan(out4)), "NaN detected — eps should prevent division by zero"

    print("All tests passed!")
    print(f"Output (gamma=1, beta=0):\\n{torch.round(out1 * 10000) / 10000}")
    print(f"Per-sample means: {out1.mean(dim=-1)}  (should be ~0)")
    print(f"Per-sample stds:  {out1.std(dim=-1, unbiased=False)}  (should be ~1)")
`,
  },

  {
    id: 'multi-head-attention',
    title: 'Multi-Head Attention',
    module: 'Transformer Layers',
    difficulty: 'advanced',
    language: 'python',
    tags: ['torch', 'attention', 'transformer', 'multi-head', 'projection'],
    description: `Implement multi-head attention — the mechanism that lets a transformer
attend to information from different representation subspaces simultaneously.

  MultiHead(Q, K, V) = Concat(head_1, …, head_h) W_O
  where head_i = Attention(Q W_Qi, K W_Ki, V W_Vi)

Using combined projection matrices W_q, W_k, W_v (each d_model × d_model)
and an output matrix W_o (d_model × d_model), the five steps are:

  1. Project   Q' = Q @ W_q,  K' = K @ W_k,  V' = V @ W_v
               Each has shape (seq_len, d_model)

  2. Split     Reshape each into (num_heads, seq_len, d_k)
               where d_k = d_model // num_heads

  3. Attend    Apply scaled dot-product attention to each head independently
               Each head_i: (seq_len, d_k) × (seq_len, d_k) × (seq_len, d_k) → (seq_len, d_k)

  4. Concat    Stack all head outputs along the last axis → (seq_len, d_model)

  5. Project   output = concat @ W_o

softmax and scaled_dot_product_attention are provided — build on them.

Requirements:
  • d_model must be divisible by num_heads (enforced by the test harness).
  • Output shape: (seq_len, d_model).
  • Use only PyTorch.`,

    staticHint: `The key is step 2 — how you split the projected matrices into heads.

After Q' = Q @ W_q you have shape (seq_len, d_model).
Reshape to expose individual heads:

  d_k = d_model // num_heads
  Q_heads = Q_proj.reshape(seq_len, num_heads, d_k).permute(1, 0, 2)
  # Q_heads: (num_heads, seq_len, d_k)

Do the same for K_heads and V_heads.

Then loop over heads 0..num_heads-1, calling scaled_dot_product_attention
on Q_heads[i], K_heads[i], V_heads[i]. Collect the (seq_len, d_k) results.

  concat = torch.cat(head_outputs, dim=-1)  # (seq_len, d_model)
  return concat @ W_o`,

    starterCode: `import torch


def softmax(x: torch.Tensor, dim: int = -1) -> torch.Tensor:
    """Numerically stable softmax. Provided — do not modify."""
    x_max = torch.max(x, dim=dim, keepdim=True).values
    e_x = torch.exp(x - x_max)
    return e_x / torch.sum(e_x, dim=dim, keepdim=True)


def scaled_dot_product_attention(
    Q: torch.Tensor, K: torch.Tensor, V: torch.Tensor
) -> torch.Tensor:
    """Single-head scaled dot-product attention. Provided — do not modify."""
    d_k = Q.shape[-1]
    scores = Q @ K.T / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))
    return softmax(scores) @ V


def multi_head_attention(
    Q: torch.Tensor,
    K: torch.Tensor,
    V: torch.Tensor,
    W_q: torch.Tensor,
    W_k: torch.Tensor,
    W_v: torch.Tensor,
    W_o: torch.Tensor,
    num_heads: int,
) -> torch.Tensor:
    """
    Multi-head attention.

    MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W_O
    where head_i = Attention(Q W_Qi, K W_Ki, V W_Vi)

    Args:
        Q, K, V:   Input tensors of shape (seq_len, d_model)
        W_q, W_k, W_v: Projection matrices of shape (d_model, d_model)
        W_o:       Output projection of shape (d_model, d_model)
        num_heads: Number of attention heads h.
                   Requires d_model % num_heads == 0.

    Returns:
        Output of shape (seq_len, d_model)
    """
    # YOUR CODE HERE
    pass


# ── Test harness (do not modify below this line) ───────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(7)

    seq_len  = 6
    d_model  = 16
    num_heads = 4
    d_k = d_model // num_heads  # 4 per head

    # Random inputs and weight matrices
    Q  = torch.randn(seq_len, d_model)
    K  = torch.randn(seq_len, d_model)
    V  = torch.randn(seq_len, d_model)
    W_q = torch.randn(d_model, d_model)
    W_k = torch.randn(d_model, d_model)
    W_v = torch.randn(d_model, d_model)
    W_o = torch.randn(d_model, d_model)

    out = multi_head_attention(Q, K, V, W_q, W_k, W_v, W_o, num_heads)

    assert out is not None, "Function returned None — did you forget to return?"
    assert isinstance(out, torch.Tensor), f"Expected torch.Tensor, got {type(out)}"
    assert out.shape == (seq_len, d_model), (
        f"Output shape wrong: expected ({seq_len}, {d_model}), got {out.shape}"
    )

    # Reference implementation
    def _ref(Q, K, V, W_q, W_k, W_v, W_o, num_heads):
        seq_len, d_model = Q.shape
        d_k = d_model // num_heads
        Q_proj = (Q @ W_q).reshape(seq_len, num_heads, d_k).permute(1, 0, 2)
        K_proj = (K @ W_k).reshape(seq_len, num_heads, d_k).permute(1, 0, 2)
        V_proj = (V @ W_v).reshape(seq_len, num_heads, d_k).permute(1, 0, 2)
        heads = [scaled_dot_product_attention(Q_proj[i], K_proj[i], V_proj[i])
                 for i in range(num_heads)]
        return torch.cat(heads, dim=-1) @ W_o

    expected = _ref(Q, K, V, W_q, W_k, W_v, W_o, num_heads)
    assert torch.allclose(out, expected, atol=1e-6), (
        f"Output does not match reference.\\nMax diff: {torch.max(torch.abs(out - expected)):.2e}"
    )

    # Projections must be used: output should change when W_q changes
    W_q2 = torch.randn(d_model, d_model)
    out2 = multi_head_attention(Q, K, V, W_q2, W_k, W_v, W_o, num_heads)
    assert not torch.allclose(out, out2), (
        "Output did not change when W_q was replaced — are you actually projecting Q?"
    )

    # Increasing heads with same weights must change the output
    out_h2 = multi_head_attention(Q, K, V, W_q, W_k, W_v, W_o, num_heads=2)
    assert not torch.allclose(out, out_h2), (
        "Output should differ for num_heads=2 vs num_heads=4"
    )

    print("All tests passed!")
    print(f"Output shape:  {out.shape}")
    print(f"num_heads=4  output[0,:4]: {torch.round(out[0, :4] * 10000) / 10000}")
    print(f"num_heads=2  output[0,:4]: {torch.round(out_h2[0, :4] * 10000) / 10000}")
`,
  },

  {
    id: 'rotary-position-embedding',
    title: 'Rotary Position Embedding (RoPE)',
    module: 'Positional Encoding',
    difficulty: 'advanced',
    language: 'python',
    tags: ['torch', 'positional encoding', 'attention', 'rotation', 'transformer'],
    visualization: PRoPEVisualization,
    description: `Apply Rotary Position Embedding (RoPE) to a query or key tensor.

Introduced by Su et al. (RoFormer, 2021), RoPE rotates each consecutive pair of
dimensions by a position-dependent angle so that the dot product Q·K depends only
on the relative offset between tokens — the key property used by LLaMA, PaLM, and GPT-NeoX.

For token at position m, consecutive pair index i (0 ≤ i < d/2):

  👉 Frequencies:
     θᵢ = base^(−2i / d)           (geometric frequencies; larger i → smaller angle)

  👉 Pairwise Rotation:
     [a']   [  cos(m·θᵢ)   -sin(m·θᵢ) ] [a]
     [b'] = [  sin(m·θᵢ)    cos(m·θᵢ) ] [b]
     where (a, b) = (x_{2i}, x_{2i+1}) is a consecutive pair of input dimensions.

Efficient closed form (no explicit rotation matrices):

  ┌──────────────────────────────────────────────────────────────────┐
  │  x_rot  =  x · cos_emb  +  rotate_half(x) · sin_emb              │
  └──────────────────────────────────────────────────────────────────┘

📋 Tensor Reference Table:
  +------------+------------------------------------+---------------------+
  | Tensor     | Description                        | Shape               |
  +------------+------------------------------------+---------------------+
  | x          | query or key matrix                | (seq_len, d_head)   |
  | positions  | integer token position indices     | (seq_len,)          |
  | θ          | per-pair frequencies               | (d_head/2,)         |
  | angles     | m · θᵢ products                    | (seq_len, d_head/2) |
  | cos_emb    | cosines, tiled to full d_head      | (seq_len, d_head)   |
  | sin_emb    | sines,   tiled to full d_head      | (seq_len, d_head)   |
  | output     | rotated tensor                     | (seq_len, d_head)   |
  +------------+------------------------------------+---------------------+

Steps:
  1. Compute θᵢ = base^(−2i/d_head) for i = 0 … d_head/2−1    → shape (d_head/2,)
  2. Build angle matrix: angles = positions[:, None] * θ[None, :]  → shape (seq_len, d_head/2)
  3. Tile to full dimension:
       cos_emb = concat([cos(angles), cos(angles)], axis=-1)  → shape (seq_len, d_head)
       sin_emb = concat([sin(angles), sin(angles)], axis=-1)  → shape (seq_len, d_head)
  4. Compute rotate_half(x): split x → [x₁ | x₂], return [−x₂ | x₁]
  5. Apply: x_rot = x * cos_emb + rotate_half(x) * sin_emb    → shape (seq_len, d_head)

Requirements:
  • Use only PyTorch. d_head is guaranteed even.
  • Output shape must match input x exactly: (seq_len, d_head).
  • rotate_half is provided — call it, do not reimplement it.
  • Apply RoPE only to Q and K, never to V.`,

    staticHint: `The trickiest step is getting cos_emb and sin_emb to shape (seq_len, d_head)
when your angles matrix has shape (seq_len, d_head//2).

Here is the setup to compute angles:

  half = d_head // 2
  theta = base ** (-2.0 * torch.arange(half, dtype=torch.float32) / d_head)
  angles = positions.unsqueeze(1) * theta.unsqueeze(0)   # (seq_len, half)

Now cos(angles) has shape (seq_len, half). You need (seq_len, d_head) — each
angle needs to appear twice. Why twice? Trace the formula for a single pair
(a, b) with cos_emb = [c, c] and sin_emb = [s, s]:

  rotate_half([a, b]) = [-b, a]
  [a, b] * [c, c] + [-b, a] * [s, s] = [a·c − b·s, b·c + a·s]

Does that match the rotation matrix in the problem statement?`,

    starterCode: `import torch


# ── Provided helper (do not modify) ──────────────────────────────────────────

def rotate_half(x: torch.Tensor) -> torch.Tensor:
    """Split x into two halves and return [-second_half | first_half]. Provided — do not modify."""
    half = x.shape[-1] // 2
    x1, x2 = x[..., :half], x[..., half:]
    return torch.cat([-x2, x1], dim=-1)


def apply_rotary_embeddings(
    x: torch.Tensor,
    positions: torch.Tensor,
    base: float = 10000.0,
) -> torch.Tensor:
    """
    Apply Rotary Position Embeddings (RoPE) to a query or key matrix.

    Each consecutive pair (x_{2i}, x_{2i+1}) is rotated by angle m*theta_i,
    where m is the token position and theta_i = base^(-2i/d_head).

    Efficient form:  x_rot = x * cos_emb + rotate_half(x) * sin_emb

    Args:
        x:         Query or key tensor of shape (seq_len, d_head). d_head must be even.
        positions: Integer token position indices of shape (seq_len,).
        base:      Frequency base (default 10000.0, as in the RoFormer paper).

    Returns:
        Rotated tensor of shape (seq_len, d_head).
    """
    # YOUR CODE HERE
    pass


# ── Test harness (do not modify below this line) ──────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(17)

    seq_len, d_head = 6, 8
    x = torch.randn(seq_len, d_head)
    positions = torch.arange(seq_len)

    out = apply_rotary_embeddings(x, positions)

    assert out is not None, "Function returned None — did you forget to return?"
    assert isinstance(out, torch.Tensor), f"Expected torch.Tensor, got {type(out)}"
    assert out.shape == (seq_len, d_head), (
        f"Shape wrong: expected ({seq_len}, {d_head}), got {out.shape}"
    )

    # Reference implementation
    def _ref(x, positions, base=10000.0):
        seq_len, d_head = x.shape
        half = d_head // 2
        i = torch.arange(half, dtype=torch.float32)
        theta = base ** (-2.0 * i / d_head)
        angles = positions.unsqueeze(1) * theta.unsqueeze(0)
        cos_emb = torch.cat([torch.cos(angles), torch.cos(angles)], dim=-1)
        sin_emb = torch.cat([torch.sin(angles), torch.sin(angles)], dim=-1)
        x1, x2 = x[:, :half], x[:, half:]
        rx = torch.cat([-x2, x1], dim=-1)
        return x * cos_emb + rx * sin_emb

    expected = _ref(x, positions)
    assert torch.allclose(out, expected, atol=1e-6), (
        f"Numerical mismatch. Max diff: {torch.max(torch.abs(out - expected)):.2e}"
    )

    # Test 2: position 0 is the identity (all angles = 0, cos=1, sin=0)
    x_pos0 = torch.randn(1, d_head)
    out_pos0 = apply_rotary_embeddings(x_pos0, torch.tensor([0]))
    assert torch.allclose(out_pos0, x_pos0, atol=1e-6), (
        "At position 0 all rotation angles are 0, so apply_rotary_embeddings must return x unchanged"
    )

    # Test 3: rotation preserves L2 norm (RoPE is block-orthogonal)
    norms_in = torch.linalg.vector_norm(x, dim=-1)
    norms_out = torch.linalg.vector_norm(out, dim=-1)
    assert torch.allclose(norms_in, norms_out, atol=1e-5), (
        f"RoPE must preserve each token L2 norm. Max norm diff: {torch.max(torch.abs(norms_in - norms_out)):.2e}"
    )

    # Test 4: different positions → different output (wrong-implementation detector)
    positions_shifted = positions + 5
    out_shifted = apply_rotary_embeddings(x, positions_shifted)
    assert not torch.allclose(out, out_shifted), (
        "Output did not change when positions shifted by 5 — are you using the positions argument?"
    )

    # Test 5: different base → different output (wrong-implementation detector)
    out_base100 = apply_rotary_embeddings(x, positions, base=100.0)
    assert not torch.allclose(out, out_base100), (
        "Output did not change when base changed to 100.0 — are you using the base argument?"
    )

    print("All tests passed!")
    print(f"Output shape: {out.shape}")
    print(f"Position-0 identity error: {torch.max(torch.abs(out_pos0 - x_pos0)):.2e}  (should be ~0)")
    print(f"Max norm drift:            {torch.max(torch.abs(norms_in - norms_out)):.2e}  (should be ~0)")
`,
  },
  {
    id: 'proportional-rope',
    title: 'Proportional RoPE (p-RoPE)',
    module: 'Positional Encoding',
    difficulty: 'advanced',
    language: 'python',
    tags: ['torch', 'positional encoding', 'long context', 'rope', 'transformer'],
    visualization: PRoPEVisualization,
    description: `Apply Proportional/Partial Rotary Position Embedding (p-RoPE) to a query or key tensor.

Introduced by Barbero et al. (ICLR 2025, "Round and Round We Go! What Makes Rotary Positional Encodings Useful?"), p-RoPE is a powerful context-scaling variant used in state-of-the-art models like Gemma 4. It addresses long-context degradation by restricting rotary position embeddings only to the highest frequency channels while leaving the lowest frequencies unrotated (NoPE). This preserves robust, distance-agnostic "semantic channels" that do not drift over ultra-long distances.

For a percentage p ∈ [0, 1] of frequency channels to keep, we compute the number of rotated frequency pairs as:

  👉 Rotated Pairs count:
     rope_angles = ⌊ p × (d_head / 2) ⌋

For pair index i (0 ≤ i < d_head/2):

  👉 Segmented Frequencies:
     θᵢ = base^(−2i / d_head)   if i < rope_angles
     θᵢ = 0                     otherwise (unrotated semantic channels)

The rotary transformation in closed form:

  ┌──────────────────────────────────────────────────────────────────┐
  │  x_rot  =  x · cos_emb  +  rotate_half(x) · sin_emb              │
  └──────────────────────────────────────────────────────────────────┘

📋 Tensor Reference Table:
  +------------+------------------------------------+---------------------+
  | Tensor     | Description                        | Shape               |
  +------------+------------------------------------+---------------------+
  | x          | query or key matrix                | (seq_len, d_head)   |
  | positions  | token position indices             | (seq_len,)          |
  | θ          | frequency vector                   | (d_head/2,)         |
  | angles     | m · θᵢ products                    | (seq_len, d_head/2) |
  | cos_emb    | cosines, tiled to full d_head      | (seq_len, d_head)   |
  | sin_emb    | sines,   tiled to full d_head      | (seq_len, d_head)   |
  | output     | output matrix                      | (seq_len, d_head)   |
  +------------+------------------------------------+---------------------+

Data flow:
  An interactive, animated graphical flowchart is available in the visualizer above! Hover over any node to explore the exact shape transformations and values.

Steps:
  1. Compute split sizes: rope_angles = int(rope_percentage * d_head // 2) and nope_angles = (d_head // 2) - rope_angles.
  2. Compute theta_i = base^(-2i/d_head) for i = 0 … rope_angles - 1.
  3. Pad the frequency array with nope_angles zeros at the end to form a complete vector of shape (d_head/2,).
  4. Compute the angle matrix: angles = positions[:, None] * theta[None, :].
  5. Tile sines and cosines:
       cos_emb = concat([cos(angles), cos(angles)], axis=-1)
       sin_emb = concat([sin(angles), sin(angles)], axis=-1)
  6. Apply rotation using the provided rotate_half: x_rot = x * cos_emb + rotate_half(x) * sin_emb.

Requirements:
  • Use only PyTorch. d_head is guaranteed even.
  • Output shape must match input x exactly: (seq_len, d_head).
  • rotate_half is provided — call it, do not reimplement it.
  • Unrotated dimensions must remain completely unchanged (equal to the input x).`,

    staticHint: `To restrict the rotation to a fraction of the channels, you need to zero out the frequencies for the non-rotated channels.

Here is the setup for computing the frequencies:
\`\`\`python
half = d_head // 2
rope_angles = int(rope_percentage * half)
nope_angles = half - rope_angles

# Compute frequencies only for the first 'rope_angles'
i = torch.arange(rope_angles, dtype=torch.float32)
theta_rotated = base ** (-2.0 * i / d_head)

# Pad with zeros so the unrotated channels have a frequency of 0
import torch.nn.functional as F
theta = F.pad(theta_rotated, (0, nope_angles), value=0.0)
\`\`\`

Why does padding the frequencies with 0.0 guarantee that those dimensions are left unrotated? Think about what happens to the rotation angles, the cosine, and the sine of these dimensions!`,

    starterCode: `import torch


# ── Provided helper (do not modify) ──────────────────────────────────────────

def rotate_half(x: torch.Tensor) -> torch.Tensor:
    """Split x into two halves and return [-second_half | first_half]. Provided — do not modify."""
    half = x.shape[-1] // 2
    x1, x2 = x[..., :half], x[..., half:]
    return torch.cat([-x2, x1], dim=-1)


def apply_proportional_rope(
    x: torch.Tensor,
    positions: torch.Tensor,
    rope_percentage: float = 0.5,
    base: float = 10000.0,
) -> torch.Tensor:
    """
    Apply Proportional/Partial Rotary Position Embeddings (p-RoPE) to a query or key matrix.

    Only the first rope_percentage fraction of dimensions are rotated.
    The remaining dimensions are left unrotated to act as stable semantic channels.

    Args:
        x:               Query or key tensor of shape (seq_len, d_head). d_head must be even.
        positions:       Integer token position indices of shape (seq_len,).
        rope_percentage: Fraction of frequency channels to keep (between 0.0 and 1.0).
        base:            Frequency base (default 10000.0).

    Returns:
        Rotated tensor of shape (seq_len, d_head).
    """
    # YOUR CODE HERE
    pass


# ── Test harness (do not modify below this line) ──────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(81)

    seq_len, d_head = 6, 8
    x = torch.randn(seq_len, d_head)
    positions = torch.arange(seq_len)

    out = apply_proportional_rope(x, positions, rope_percentage=0.5)

    assert out is not None, "Function returned None — did you forget to return?"
    assert isinstance(out, torch.Tensor), f"Expected torch.Tensor, got {type(out)}"
    assert out.shape == (seq_len, d_head), (
        f"Shape wrong: expected ({seq_len}, {d_head}), got {out.shape}"
    )

    # Reference implementation
    def _ref(x, positions, rope_percentage=0.5, base=10000.0):
        seq_len, d_head = x.shape
        half = d_head // 2
        rope_angles = int(rope_percentage * half)
        nope_angles = half - rope_angles
        i = torch.arange(rope_angles, dtype=torch.float32)
        theta_rotated = base ** (-2.0 * i / d_head)
        import torch.nn.functional as F
        theta = F.pad(theta_rotated, (0, nope_angles), value=0.0)
        angles = positions.unsqueeze(1) * theta.unsqueeze(0)
        cos_emb = torch.cat([torch.cos(angles), torch.cos(angles)], dim=-1)
        sin_emb = torch.cat([torch.sin(angles), torch.sin(angles)], dim=-1)
        return x * cos_emb + rotate_half(x) * sin_emb

    expected = _ref(x, positions, rope_percentage=0.5)
    assert torch.allclose(out, expected, atol=1e-6), (
        f"Numerical mismatch. Max diff: {torch.max(torch.abs(out - expected)):.2e}"
    )

    # ── Test 2: rope_percentage = 0.0 is NoPE (Identity mapping) ─────────────────
    out_nope = apply_proportional_rope(x, positions, rope_percentage=0.0)
    assert torch.allclose(out_nope, x, atol=1e-6), (
        "With rope_percentage = 0.0, output must be identical to input x"
    )

    # ── Test 3: rope_percentage = 1.0 matches standard RoPE ──────────────────────
    out_full = apply_proportional_rope(x, positions, rope_percentage=1.0)
    expected_full = _ref(x, positions, rope_percentage=1.0)
    assert torch.allclose(out_full, expected_full, atol=1e-6), (
        "With rope_percentage = 1.0, output must match standard RoPE exactly"
    )

    # ── Test 4: rotation preserves L2 norm (RoPE is block-orthogonal) ─────────────
    norms_in = torch.linalg.vector_norm(x, dim=-1)
    norms_out = torch.linalg.vector_norm(out, dim=-1)
    assert torch.allclose(norms_in, norms_out, atol=1e-5), (
        f"p-RoPE must preserve each token L2 norm. Max norm drift: {torch.max(torch.abs(norms_in - norms_out)):.2e}"
    )

    # ── Test 5: wrong-implementation detectors ────────────────────────────────────
    # Test 5.1: different positions → different output
    out_shifted = apply_proportional_rope(x, positions + 5, rope_percentage=0.5)
    assert not torch.allclose(out, out_shifted), (
        "Output did not change when positions shifted — are you using the positions argument?"
    )

    # Test 5.2: different rope_percentage → different output
    out_p75 = apply_proportional_rope(x, positions, rope_percentage=0.75)
    assert not torch.allclose(out, out_p75), (
        "Output did not change when rope_percentage changed — are you using it?"
    )

    print("All tests passed!")
    print(f"Output shape: {out.shape}")
    print(f"Norm drift: {torch.max(torch.abs(norms_in - norms_out)):.2e}  (should be ~0)")
    print(f"NoPE identity check error: {torch.max(torch.abs(out_nope - x)):.2e}  (should be ~0)")
`,
  },
]
