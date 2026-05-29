import type { Challenge } from '../types/challenge'
import { Conv2dVisualization } from '../visualizations/Conv2dVisualization'
import { GQAVisualization } from '../visualizations/GQAVisualization'
import { PRoPEVisualization } from '../visualizations/PRoPEVisualization'
import { SinusoidalVisualization } from '../visualizations/SinusoidalVisualization'

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
    solutionCode: `import torch


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
    return X @ W + b


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
    solutionCode: `import torch


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
    return torch.clamp(x, min=0.0)


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
    solutionCode: `import torch


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
    d_k = Q.shape[-1]
    scores = Q @ K.T / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))
    weights = softmax(scores)
    return weights @ V


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
    solutionCode: `import torch


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
    mean = torch.mean(x, dim=-1, keepdim=True)
    var = torch.var(x, dim=-1, keepdim=True, unbiased=False)
    x_norm = (x - mean) / torch.sqrt(var + eps)
    return gamma * x_norm + beta


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
    solutionCode: `import torch


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
    seq_len, d_model = Q.shape
    d_k = d_model // num_heads
    Q_proj = (Q @ W_q).reshape(seq_len, num_heads, d_k).permute(1, 0, 2)
    K_proj = (K @ W_k).reshape(seq_len, num_heads, d_k).permute(1, 0, 2)
    V_proj = (V @ W_v).reshape(seq_len, num_heads, d_k).permute(1, 0, 2)
    heads = [scaled_dot_product_attention(Q_proj[i], K_proj[i], V_proj[i])
             for i in range(num_heads)]
    concat = torch.cat(heads, dim=-1)
    return concat @ W_o


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
    solutionCode: `import torch


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
    seq_len, d_head = x.shape
    half = d_head // 2
    i = torch.arange(half, dtype=torch.float32)
    theta = base ** (-2.0 * i / d_head)
    angles = positions.unsqueeze(1) * theta.unsqueeze(0)
    cos_emb = torch.cat([torch.cos(angles), torch.cos(angles)], dim=-1)
    sin_emb = torch.cat([torch.sin(angles), torch.sin(angles)], dim=-1)
    return x * cos_emb + rotate_half(x) * sin_emb


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
        f"RoPE must preserve each token L2 norm. Max norm drift: {torch.max(torch.abs(norms_in - norms_out)):.2e}"
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
    solutionCode: `import torch


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
  {
    id: 'triton-vector-add',
    title: 'Vector Addition Kernel (Triton)',
    module: 'GPU Kernels',
    difficulty: 'beginner',
    language: 'python',
    tags: ['triton', 'gpu', 'kernels', 'element-wise'],
    description: `Implement a parallel vector addition kernel using OpenAI's Triton language.

Triton is a language and compiler designed for writing highly efficient custom deep learning primitives. Instead of operating at the thread level (like CUDA), Triton operates at the block level, allowing you to load, compute, and store block-sized chunks of data in parallel.

The kernel computes:
  Z[i] = X[i] + Y[i]

Where:
  X  — input vector   shape: (N,)
  Y  — input vector   shape: (N,)
  Z  — output vector  shape: (N,)

Tensors are laid out contiguously in memory. Since the total number of elements N may not be a perfect multiple of the block size, you must use a boundary safety mask to prevent out-of-bounds DRAM memory access.

Data-flow and memory block mapping:
  DRAM Memory:
  [ x_ptr ] ──→ [ Block 0 ] [ Block 1 ] [ Block 2 (Partial) ]
                 │
                 ├──→ Program ID 0 (pid = 0)
                 │    offsets = [0, 1, 2, ..., BLOCK_SIZE-1]
                 │    mask    = offsets < n_elements
                 │    tl.load ──→ tl.store (output_ptr)

Steps:
  1. Query the program instance ID: pid = tl.program_id(axis=0)
  2. Compute memory start position of this block: block_start = pid * BLOCK_SIZE
  3. Compute absolute element offsets: offsets = block_start + tl.arange(0, BLOCK_SIZE)
  4. Build safety mask to prevent out-of-bounds memory accesses: mask = offsets < n_elements
  5. Load vector blocks from DRAM: x = tl.load(x_ptr + offsets, mask)
  6. Load vector blocks from DRAM: y = tl.load(y_ptr + offsets, mask)
  7. Compute element-wise sum: output = x + y
  8. Store result block back to DRAM: tl.store(output_ptr + offsets, output, mask)

Requirements:
  • Use only triton.language (tl) primitives.
  • Correctly compute program IDs and memory offsets.
  • Implement boundary safety masking.`,

    staticHint: `Getting started with Triton requires shifting from thread-level thinking to block-level thinking.

First, identify which block of elements this specific program instance is responsible for:
  - You can query the program ID along axis 0 using: pid = tl.program_id(axis=0)
  - The starting offset for this block's memory is: block_start = pid * BLOCK_SIZE

Next, build the vector of target offsets using 'tl.arange' and add 'block_start':
  offsets = block_start + tl.arange(0, BLOCK_SIZE)

Don't forget the mask! If the total number of elements 'n_elements' is not divisible by 'BLOCK_SIZE', some threads in the final block will access memory out of bounds. The boundary safety mask is:
  mask = offsets < n_elements

Why do we add the starting pointer ('x_ptr') to the offsets when loading? Remember that 'x_ptr' is a pointer to the start of the array, so 'x_ptr + offsets' represents a block of memory addresses that we load directly from DRAM.`,

    starterCode: `import torch
import triton
import triton.language as tl


@triton.jit
def add_kernel(
    x_ptr,
    y_ptr,
    output_ptr,
    n_elements: int,
    BLOCK_SIZE: tl.constexpr,
):
    """
    Triton vector addition kernel.
    Computes output_ptr[i] = x_ptr[i] + y_ptr[i] in parallel blocks of BLOCK_SIZE.

    Args:
        x_ptr:      Pointer to first input vector in DRAM.
        y_ptr:      Pointer to second input vector in DRAM.
        output_ptr: Pointer to output vector in DRAM.
        n_elements: Total number of elements in the vectors.
        BLOCK_SIZE: Number of elements processed by each program instance.
    """
    # YOUR CODE HERE
    pass


# ── Launcher helper (do not modify) ──────────────────────────────────────────

def vector_add(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    """Launcher helper that allocates output memory, defines grid, and executes kernel."""
    output = torch.empty_like(x)
    n_elements = x.numel()
    BLOCK_SIZE = 512
    # The grid is a 1D sequence of blocks
    grid = lambda meta: (triton.cdiv(n_elements, meta['BLOCK_SIZE']),)
    add_kernel[grid](x, y, output, n_elements, BLOCK_SIZE=BLOCK_SIZE)
    return output


# ── Test harness (do not modify below this line) ──────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(42)

    # Test 1: Vector size perfectly divisible by BLOCK_SIZE (512 * 2 = 1024)
    N1 = 1024
    X1 = torch.randn(N1, dtype=torch.float32)
    Y1 = torch.randn(N1, dtype=torch.float32)

    out1 = vector_add(X1, Y1)
    assert out1 is not None, "vector_add returned None — did you forget to return in your launcher or kernel?"
    assert isinstance(out1, torch.Tensor), f"Expected torch.Tensor, got {type(out1)}"
    assert out1.shape == (N1,), f"Shape wrong: expected ({N1},), got {out1.shape}"

    expected1 = X1 + Y1
    assert torch.allclose(out1, expected1, atol=1e-5), "Test 1 failed: values do not match native PyTorch addition"

    # Test 2: Vector size NOT divisible by BLOCK_SIZE (edge masking test)
    N2 = 983
    X2 = torch.randn(N2, dtype=torch.float32)
    Y2 = torch.randn(N2, dtype=torch.float32)

    out2 = vector_add(X2, Y2)
    assert out2.shape == (N2,), f"Shape wrong for unaligned vector: expected ({N2},), got {out2.shape}"

    expected2 = X2 + Y2
    assert torch.allclose(out2, expected2, atol=1e-5), "Test 2 failed: boundary masking is incorrect or missing"

    # Test 3: Zero vector addition
    X3 = torch.zeros(300, dtype=torch.float32)
    Y3 = torch.zeros(300, dtype=torch.float32)
    out3 = vector_add(X3, Y3)
    assert torch.allclose(out3, torch.tensor(0.0)), "Test 3 failed: addition of zero vectors must yield zero vector"

    # Test 4: Constant vector addition
    X4 = torch.full((100,), 5.0, dtype=torch.float32)
    Y4 = torch.full((100,), 7.0, dtype=torch.float32)
    out4 = vector_add(X4, Y4)
    assert torch.allclose(out4, torch.tensor(12.0)), "Test 4 failed: constant vector addition incorrect"

    print("All tests passed!")
    print(f"Unaligned vector (N=983) successfully compiled and executed!")
    print(f"Sample output values (first 5 elements):")
    print(f"  {out2[:5]}")
`,
    solutionCode: `import torch
import triton
import triton.language as tl


@triton.jit
def add_kernel(
    x_ptr,
    y_ptr,
    output_ptr,
    n_elements: int,
    BLOCK_SIZE: tl.constexpr,
):
    """
    Triton vector addition kernel.
    Computes output_ptr[i] = x_ptr[i] + y_ptr[i] in parallel blocks of BLOCK_SIZE.

    Args:
        x_ptr:      Pointer to first input vector in DRAM.
        y_ptr:      Pointer to second input vector in DRAM.
        output_ptr: Pointer to output vector in DRAM.
        n_elements: Total number of elements in the vectors.
        BLOCK_SIZE: Number of elements processed by each program instance.
    """
    pid = tl.program_id(axis=0)
    block_start = pid * BLOCK_SIZE
    offsets = block_start + tl.arange(0, BLOCK_SIZE)
    mask = offsets < n_elements
    x = tl.load(x_ptr + offsets, mask=mask)
    y = tl.load(y_ptr + offsets, mask=mask)
    output = x + y
    tl.store(output_ptr + offsets, output, mask=mask)


# ── Launcher helper (do not modify) ──────────────────────────────────────────

def vector_add(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    """Launcher helper that allocates output memory, defines grid, and executes kernel."""
    output = torch.empty_like(x)
    n_elements = x.numel()
    BLOCK_SIZE = 512
    # The grid is a 1D sequence of blocks
    grid = lambda meta: (triton.cdiv(n_elements, meta['BLOCK_SIZE']),)
    add_kernel[grid](x, y, output, n_elements, BLOCK_SIZE=BLOCK_SIZE)
    return output


# ── Test harness (do not modify below this line) ──────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(42)

    # Test 1: Vector size perfectly divisible by BLOCK_SIZE (512 * 2 = 1024)
    N1 = 1024
    X1 = torch.randn(N1, dtype=torch.float32)
    Y1 = torch.randn(N1, dtype=torch.float32)

    out1 = vector_add(X1, Y1)
    assert out1 is not None, "vector_add returned None — did you forget to return in your launcher or kernel?"
    assert isinstance(out1, torch.Tensor), f"Expected torch.Tensor, got {type(out1)}"
    assert out1.shape == (N1,), f"Shape wrong: expected ({N1},), got {out1.shape}"

    expected1 = X1 + Y1
    assert torch.allclose(out1, expected1, atol=1e-5), "Test 1 failed: values do not match native PyTorch addition"

    # Test 2: Vector size NOT divisible by BLOCK_SIZE (edge masking test)
    N2 = 983
    X2 = torch.randn(N2, dtype=torch.float32)
    Y2 = torch.randn(N2, dtype=torch.float32)

    out2 = vector_add(X2, Y2)
    assert out2.shape == (N2,), f"Shape wrong for unaligned vector: expected ({N2},), got {out2.shape}"

    expected2 = X2 + Y2
    assert torch.allclose(out2, expected2, atol=1e-5), "Test 2 failed: boundary masking is incorrect or missing"

    # Test 3: Zero vector addition
    X3 = torch.zeros(300, dtype=torch.float32)
    Y3 = torch.zeros(300, dtype=torch.float32)
    out3 = vector_add(X3, Y3)
    assert torch.allclose(out3, torch.tensor(0.0)), "Test 3 failed: addition of zero vectors must yield zero vector"

    # Test 4: Constant vector addition
    X4 = torch.full((100,), 5.0, dtype=torch.float32)
    Y4 = torch.full((100,), 7.0, dtype=torch.float32)
    out4 = vector_add(X4, Y4)
    assert torch.allclose(out4, torch.tensor(12.0)), "Test 4 failed: constant vector addition incorrect"

    print("All tests passed!")
    print(f"Unaligned vector (N=983) successfully compiled and executed!")
    print(f"Sample output values (first 5 elements):")
    print(f"  {out2[:5]}")
`,
  },
  {
    id: 'sinusoidal-positional-encoding',
    title: 'Sinusoidal Positional Encoding',
    module: 'Positional Encoding',
    difficulty: 'intermediate',
    language: 'python',
    tags: ['torch', 'positional encoding', 'transformer', 'sinusoidal'],
    visualization: SinusoidalVisualization,
    description: `Inject positional information into token representations. Since the Transformer architecture (Vaswani et al., "Attention Is All You Need", 2017) has no recurrence or convolution, it uses sinusoidal positional encodings to represent the absolute or relative positions of tokens in a sequence.

The positional encodings are computed using sine and cosine functions of different frequencies:

┌──────────────────────────────────────────────────────────────────┐
│  PE_(pos, 2i)   = sin( pos / base^(2i / d_model) )               │
│  PE_(pos, 2i+1) = cos( pos / base^(2i / d_model) )               │
└──────────────────────────────────────────────────────────────────┘

📋 Tensor Reference Table:
  +------------+------------------------------------+---------------------+
  | Tensor     | Description                        | Shape               |
  +------------+------------------------------------+---------------------+
  | positions  | token position indices             | (seq_len,)          |
  | div_term   | frequency division factors         | (d_model/2,)        |
  | PE         | output positional encoding matrix  | (seq_len, d_model)  |
  +------------+------------------------------------+---------------------+

An interactive, animated graphical heatmap and continuous wave plot is available in the visualizer above!

Steps:
  1. Compute frequency division factors: div_term = base^(-2i/d_model) for i = 0 ... d_model/2 - 1. Shape: (d_model/2,)
  2. Compute angles: angles = positions[:, None] * div_term[None, :]. Shape: (seq_len, d_model/2)
  3. Compute sine and cosine values of the angles: sin_vals = sin(angles) and cos_vals = cos(angles). Shape: (seq_len, d_model/2)
  4. Interleave sines and cosines into the final PE matrix:
     PE[..., 0::2] = sin_vals
     PE[..., 1::2] = cos_vals
     Shape: (seq_len, d_model)

Requirements:
  • Use only PyTorch tensors.
  • Return a tensor of shape (seq_len, d_model).
  • All calculations must support dynamic sequence length (seq_len) and embedding size (d_model).
  • Ensure proper interleaving (even indices get sin, odd indices get cos).`,
    staticHint: `Have you thought about how to generate the frequencies geometrically and then interleave the sin and cos values?

Computing the division term \`div_term\` is the first key step:
\`\`\`python
half = d_model // 2
i = torch.arange(half, dtype=torch.float32)
div_term = base ** (-2.0 * i / d_model)
\`\`\`

Once you have your angles computed as a \`(seq_len, half)\` matrix, you can allocate a zero tensor of shape \`(seq_len, d_model)\`.
To interleave sines and cosines, how can you use PyTorch's slicing syntax to target all even and odd columns?

Hint: \`tensor[:, 0::2]\` targets every even column, and \`tensor[:, 1::2]\` targets every odd column. Give that a try!`,
    starterCode: `import math
import torch


def sinusoidal_positional_encoding(
    seq_len: int, d_model: int, base: float = 10000.0
) -> torch.Tensor:
    """
    Compute sinusoidal positional encodings for a sequence.

    PE_(pos, 2i)   = sin(pos / base^(2i/d_model))
    PE_(pos, 2i+1) = cos(pos / base^(2i/d_model))

    Args:
        seq_len: Length of the sequence (number of tokens).
        d_model: Dimensionality of the embeddings (must be even).
        base: Frequency base factor (default 10000.0).

    Returns:
        A tensor of shape (seq_len, d_model) containing the positional encodings.
    """
    # YOUR CODE HERE
    pass


# ── Test harness (do not modify below this line) ──────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(42)

    # Test 1: Standard shape and type check
    seq_len, d_model = 10, 16
    out = sinusoidal_positional_encoding(seq_len, d_model)
    
    assert out is not None, "Function returned None — did you forget to return?"
    assert isinstance(out, torch.Tensor), f"Expected torch.Tensor, got {type(out)}"
    assert out.shape == (seq_len, d_model), f"Shape wrong: expected ({seq_len}, {d_model}), got {out.shape}"
    assert out.dtype == torch.float32, f"Expected float32, got {out.dtype}"

    # Reference implementation
    def _ref(seq_len: int, d_model: int, base: float = 10000.0) -> torch.Tensor:
        pe = torch.zeros(seq_len, d_model)
        position = torch.arange(seq_len, dtype=torch.float32).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2, dtype=torch.float32) * (-math.log(base) / d_model))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        return pe

    expected = _ref(seq_len, d_model)
    assert torch.allclose(out, expected, atol=1e-6), (
        f"Numerical mismatch with reference.\\nMax diff: {torch.max(torch.abs(out - expected)):.2e}"
    )

    # Test 2: Edge/boundary case (smallest valid configuration)
    out_edge = sinusoidal_positional_encoding(1, 2)
    expected_edge = _ref(1, 2)
    assert out_edge.shape == (1, 2), f"Edge shape wrong: {out_edge.shape}"
    assert torch.allclose(out_edge, expected_edge, atol=1e-6), "Numerical mismatch for single token / small embedding"

    # Test 3: Trigonometric Invariant Check (sin^2 + cos^2 = 1)
    even_dims = out[:, 0::2]
    odd_dims = out[:, 1::2]
    identity_sum = even_dims ** 2 + odd_dims ** 2
    expected_ones = torch.ones_like(identity_sum)
    assert torch.allclose(identity_sum, expected_ones, atol=1e-6), (
        f"Trigonometric identity sin^2 + cos^2 = 1.0 violated.\\nMax drift: {torch.max(torch.abs(identity_sum - 1.0)):.2e}"
    )

    # Test 4: Wrong-implementation detector (different base)
    out_base = sinusoidal_positional_encoding(seq_len, d_model, base=5000.0)
    assert not torch.allclose(out, out_base), (
        "Output did not change when the frequency base was changed — are you using the base argument?"
    )

    # Test 5: Wrong-implementation detector (ignoring position index)
    assert not torch.allclose(out[0], out[1]), (
        "Positional encodings for position 0 and 1 are identical — are you using the position indices?"
    )

    print("All tests passed!")
    print(f"Output shape: {out.shape}")
    print(f"Position 0 even/odd sum of squares: {identity_sum[0, 0].item():.4f} (should be 1.0)")
`,
    solutionCode: `import math
import torch


def sinusoidal_positional_encoding(
    seq_len: int, d_model: int, base: float = 10000.0
) -> torch.Tensor:
    """
    Compute sinusoidal positional encodings for a sequence.

    PE_(pos, 2i)   = sin(pos / base^(2i/d_model))
    PE_(pos, 2i+1) = cos(pos / base^(2i/d_model))

    Args:
        seq_len: Length of the sequence (number of tokens).
        d_model: Dimensionality of the embeddings (must be even).
        base: Frequency base factor (default 10000.0).

    Returns:
        A tensor of shape (seq_len, d_model) containing the positional encodings.
    """
    half = d_model // 2
    i = torch.arange(half, dtype=torch.float32)
    div_term = base ** (-2.0 * i / d_model)
    
    positions = torch.arange(seq_len, dtype=torch.float32)
    angles = positions.unsqueeze(1) * div_term.unsqueeze(0)
    
    pe = torch.zeros(seq_len, d_model, dtype=torch.float32)
    pe[:, 0::2] = torch.sin(angles)
    pe[:, 1::2] = torch.cos(angles)
    return pe


# ── Test harness (do not modify below this line) ──────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(42)

    # Test 1: Standard shape and type check
    seq_len, d_model = 10, 16
    out = sinusoidal_positional_encoding(seq_len, d_model)
    
    assert out is not None, "Function returned None — did you forget to return?"
    assert isinstance(out, torch.Tensor), f"Expected torch.Tensor, got {type(out)}"
    assert out.shape == (seq_len, d_model), f"Shape wrong: expected ({seq_len}, {d_model}), got {out.shape}"
    assert out.dtype == torch.float32, f"Expected float32, got {out.dtype}"

    # Reference implementation
    def _ref(seq_len: int, d_model: int, base: float = 10000.0) -> torch.Tensor:
        pe = torch.zeros(seq_len, d_model)
        position = torch.arange(seq_len, dtype=torch.float32).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2, dtype=torch.float32) * (-math.log(base) / d_model))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        return pe

    expected = _ref(seq_len, d_model)
    assert torch.allclose(out, expected, atol=1e-6), (
        f"Numerical mismatch with reference.\\nMax diff: {torch.max(torch.abs(out - expected)):.2e}"
    )

    # Test 2: Edge/boundary case (smallest valid configuration)
    out_edge = sinusoidal_positional_encoding(1, 2)
    expected_edge = _ref(1, 2)
    assert out_edge.shape == (1, 2), f"Edge shape wrong: {out_edge.shape}"
    assert torch.allclose(out_edge, expected_edge, atol=1e-6), "Numerical mismatch for single token / small embedding"

    # Test 3: Trigonometric Invariant Check (sin^2 + cos^2 = 1)
    even_dims = out[:, 0::2]
    odd_dims = out[:, 1::2]
    identity_sum = even_dims ** 2 + odd_dims ** 2
    expected_ones = torch.ones_like(identity_sum)
    assert torch.allclose(identity_sum, expected_ones, atol=1e-6), (
        f"Trigonometric identity sin^2 + cos^2 = 1.0 violated.\\nMax drift: {torch.max(torch.abs(identity_sum - 1.0)):.2e}"
    )

    # Test 4: Wrong-implementation detector (different base)
    out_base = sinusoidal_positional_encoding(seq_len, d_model, base=5000.0)
    assert not torch.allclose(out, out_base), (
        "Output did not change when the frequency base was changed — are you using the base argument?"
    )

    # Test 5: Wrong-implementation detector (ignoring position index)
    assert not torch.allclose(out[0], out[1]), (
        "Positional encodings for position 0 and 1 are identical — are you using the position indices?"
    )

    print("All tests passed!")
    print(f"Output shape: {out.shape}")
    print(f"Position 0 even/odd sum of squares: {identity_sum[0, 0].item():.4f} (should be 1.0)")
`,
  },
  {
    id: 'grouped-query-attention',
    title: 'Grouped-Query Attention (GQA)',
    module: 'Transformer Layers',
    difficulty: 'advanced',
    language: 'python',
    tags: ['torch', 'attention', 'transformer', 'gqa', 'multi-head', 'kv-cache'],
    visualization: GQAVisualization,
    description: `Implement Grouped-Query Attention (GQA), the attention variant used by LLaMA 2, Mistral, Qwen, and Gemma that cuts KV-cache memory by sharing key–value heads across groups of query heads (Ainslie et al., "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints", 2023).

GQA generalises MHA (G = H, no sharing) and MQA (G = 1, maximum sharing): H query heads are split into G groups, and every query head in a group attends to the same single shared K/V head:

┌────────────────────────────────────────────────────────────────────────┐
│  For each group g  (query heads g·(H/G) … (g+1)·(H/G) − 1):           │
│    output_g  =  softmax( Q_g @ K_g^T / √d_head )  @  V_g               │
└────────────────────────────────────────────────────────────────────────┘

📋 Tensor Reference Table:
  +---------------+---------------------------------------------+-------------------------+
  | Tensor        | Description                                 | Shape                   |
  +---------------+---------------------------------------------+-------------------------+
  | Q             | Query tensor — H query heads                | (B, S, H, d_head)       |
  | K             | Key tensor — G KV heads (G ≤ H)             | (B, S, G, d_head)       |
  | V             | Value tensor — G KV heads                   | (B, S, G, d_head)       |
  | groups        | Query heads per KV head  =  H // G          | scalar                  |
  | K_expanded    | K after repeat_interleave along head dim    | (B, S, H, d_head)       |
  | V_expanded    | V after repeat_interleave along head dim    | (B, S, H, d_head)       |
  | scores        | Scaled attention scores per head            | (B, H, S, S)            |
  | weights       | Softmax attention weights per head          | (B, H, S, S)            |
  | output        | Context vectors, all query heads            | (B, S, H, d_head)       |
  +---------------+---------------------------------------------+-------------------------+

(B = batch, S = seq_len, H = num_q_heads, G = num_kv_heads)

An interactive animated grouping diagram is in the visualizer above — use the G buttons to see how query heads tile over KV heads and how the repeat_interleave factor changes.

Steps:
  1. Compute groups = H // G  (requires H % G == 0).
  2. Expand K and V to all H heads: K_exp = K.repeat_interleave(groups, dim=2)  →  (B, S, H, d_head).
  3. Permute all tensors to head-first: Q.permute(0, 2, 1, 3)  →  (B, H, S, d_head); same for K_exp and V_exp.
  4. Compute scaled scores: Q_h @ K_h.transpose(-2, -1) / sqrt(d_head)  →  (B, H, S, S).
  5. Apply row-wise softmax across the last dimension  →  attention weights  (B, H, S, S).
  6. Weighted sum: weights @ V_h  →  (B, H, S, d_head).
  7. Permute back to token-first: .permute(0, 2, 1, 3)  →  (B, S, H, d_head).

Requirements:
  • Use only PyTorch. No einops or other third-party libraries.
  • H must be divisible by G; guaranteed by the test harness.
  • Output shape: (batch, seq_len, num_q_heads, head_dim).
  • The provided softmax is numerically stable — use it, do not reimplement it.`,

    staticHint: `The key insight you need: before computing attention, expand K and V so they match the number of query heads.

Here is the expansion step:

  groups = num_q_heads // num_kv_heads   # e.g. 4 when H=8, G=2
  K_exp = K.repeat_interleave(groups, dim=2)
  # K[:, :, 0, :] is now replicated to head positions 0, 1, 2, 3
  # K[:, :, 1, :] is now replicated to head positions 4, 5, 6, 7

After that, K_exp has shape (B, S, H, d_head) — matching Q exactly. Now you can run standard batched scaled dot-product attention.

A common mistake: forgetting to permute from (B, S, H, d) to (B, H, S, d) before the matmul. Why does @ need the heads-first layout to broadcast correctly over the batch and head dimensions?`,

    starterCode: `import torch
import torch.nn.functional as F


def softmax(x: torch.Tensor, dim: int = -1) -> torch.Tensor:
    """Numerically stable softmax. Provided — do not modify."""
    x_max = torch.max(x, dim=dim, keepdim=True).values
    e_x = torch.exp(x - x_max)
    return e_x / torch.sum(e_x, dim=dim, keepdim=True)


def grouped_query_attention(
    Q: torch.Tensor,
    K: torch.Tensor,
    V: torch.Tensor,
    num_kv_heads: int,
) -> torch.Tensor:
    """
    Grouped-Query Attention (GQA).

    Divides H query heads into G groups; each group attends to one shared K/V head.
    G == H recovers standard MHA; G == 1 recovers MQA.

    Args:
        Q:            Query tensor of shape  (batch, seq_len, num_q_heads, head_dim).
        K:            Key tensor of shape    (batch, seq_len, num_kv_heads, head_dim).
        V:            Value tensor of shape  (batch, seq_len, num_kv_heads, head_dim).
        num_kv_heads: Number of KV heads G.  Must divide num_q_heads evenly.

    Returns:
        Output tensor of shape (batch, seq_len, num_q_heads, head_dim).
    """
    # YOUR CODE HERE
    pass


# ── Test harness (do not modify below this line) ──────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(13)

    batch, seq_len, num_q_heads, num_kv_heads, head_dim = 2, 6, 8, 2, 8

    Q = torch.randn(batch, seq_len, num_q_heads, head_dim)
    K = torch.randn(batch, seq_len, num_kv_heads, head_dim)
    V = torch.randn(batch, seq_len, num_kv_heads, head_dim)

    out = grouped_query_attention(Q, K, V, num_kv_heads)

    # ── Test 1: type and shape ─────────────────────────────────────────────────
    assert out is not None, "Function returned None — did you forget to return?"
    assert isinstance(out, torch.Tensor), f"Expected torch.Tensor, got {type(out)}"
    assert out.shape == (batch, seq_len, num_q_heads, head_dim), (
        f"Shape wrong: expected ({batch}, {seq_len}, {num_q_heads}, {head_dim}), got {out.shape}"
    )

    # ── Test 2: numerical match vs reference implementation ────────────────────
    def _ref(Q, K, V, num_kv_heads):
        _, _, num_q_h, head_dim = Q.shape
        groups = num_q_h // num_kv_heads
        K_exp = K.repeat_interleave(groups, dim=2)
        V_exp = V.repeat_interleave(groups, dim=2)
        Q_h = Q.permute(0, 2, 1, 3)
        K_h = K_exp.permute(0, 2, 1, 3)
        V_h = V_exp.permute(0, 2, 1, 3)
        scores = Q_h @ K_h.transpose(-2, -1) / (head_dim ** 0.5)
        s_max = scores.max(dim=-1, keepdim=True).values
        w = torch.exp(scores - s_max)
        w = w / w.sum(dim=-1, keepdim=True)
        return (w @ V_h).permute(0, 2, 1, 3)

    expected = _ref(Q, K, V, num_kv_heads)
    assert torch.allclose(out, expected, atol=1e-5), (
        f"Numerical mismatch vs reference. Max diff: {torch.max(torch.abs(out - expected)):.2e}"
    )

    # ── Test 3: F.scaled_dot_product_attention parity (built-in check) ─────────
    _g = num_q_heads // num_kv_heads
    _Ke = K.repeat_interleave(_g, dim=2).permute(0, 2, 1, 3)
    _Ve = V.repeat_interleave(_g, dim=2).permute(0, 2, 1, 3)
    _Qh = Q.permute(0, 2, 1, 3)
    expected_builtin = F.scaled_dot_product_attention(_Qh, _Ke, _Ve).permute(0, 2, 1, 3)
    assert torch.allclose(out, expected_builtin, atol=1e-4), (
        f"Mismatch vs F.scaled_dot_product_attention. Max diff: {torch.max(torch.abs(out - expected_builtin)):.2e}"
    )

    # ── Test 4: MQA case (G=1) matches reference ──────────────────────────────
    torch.manual_seed(37)
    K_one = torch.randn(batch, seq_len, 1, head_dim)
    V_one = torch.randn(batch, seq_len, 1, head_dim)
    out_mqa = grouped_query_attention(Q, K_one, V_one, num_kv_heads=1)
    assert out_mqa.shape == (batch, seq_len, num_q_heads, head_dim), (
        f"MQA output shape wrong: {out_mqa.shape}"
    )
    assert torch.allclose(out_mqa, _ref(Q, K_one, V_one, 1), atol=1e-5), (
        "GQA with num_kv_heads=1 (MQA) does not match reference"
    )

    # ── Test 5: MHA case (G=H) matches reference ──────────────────────────────
    torch.manual_seed(51)
    K_mha = torch.randn(batch, seq_len, num_q_heads, head_dim)
    V_mha = torch.randn(batch, seq_len, num_q_heads, head_dim)
    out_mha = grouped_query_attention(Q, K_mha, V_mha, num_kv_heads=num_q_heads)
    assert torch.allclose(out_mha, _ref(Q, K_mha, V_mha, num_q_heads), atol=1e-5), (
        "GQA with num_kv_heads=num_q_heads (MHA) does not match reference"
    )

    # ── Test 6: wrong-implementation detector — must use K ────────────────────
    torch.manual_seed(99)
    K_alt = torch.randn_like(K)
    out_alt = grouped_query_attention(Q, K_alt, V, num_kv_heads)
    assert not torch.allclose(out, out_alt, atol=1e-4), (
        "Output did not change when K was replaced — are you attending to K?"
    )

    print("All tests passed!")
    print(f"Output shape:          {out.shape}")
    print(f"Max diff vs reference: {torch.max(torch.abs(out - expected)):.2e}  (should be ~0)")
    print(f"MQA / MHA shapes:      {out_mqa.shape}  /  {out_mha.shape}")
`,
    solutionCode: `import torch
import torch.nn.functional as F


def softmax(x: torch.Tensor, dim: int = -1) -> torch.Tensor:
    """Numerically stable softmax. Provided — do not modify."""
    x_max = torch.max(x, dim=dim, keepdim=True).values
    e_x = torch.exp(x - x_max)
    return e_x / torch.sum(e_x, dim=dim, keepdim=True)


def grouped_query_attention(
    Q: torch.Tensor,
    K: torch.Tensor,
    V: torch.Tensor,
    num_kv_heads: int,
) -> torch.Tensor:
    """
    Grouped-Query Attention (GQA).

    Divides H query heads into G groups; each group attends to one shared K/V head.
    G == H recovers standard MHA; G == 1 recovers MQA.

    Args:
        Q:            Query tensor of shape  (batch, seq_len, num_q_heads, head_dim).
        K:            Key tensor of shape    (batch, seq_len, num_kv_heads, head_dim).
        V:            Value tensor of shape  (batch, seq_len, num_kv_heads, head_dim).
        num_kv_heads: Number of KV heads G.  Must divide num_q_heads evenly.

    Returns:
        Output tensor of shape (batch, seq_len, num_q_heads, head_dim).
    """
    _, _, num_q_heads, head_dim = Q.shape
    groups = num_q_heads // num_kv_heads
    K_exp = K.repeat_interleave(groups, dim=2)
    V_exp = V.repeat_interleave(groups, dim=2)
    Q_h = Q.permute(0, 2, 1, 3)
    K_h = K_exp.permute(0, 2, 1, 3)
    V_h = V_exp.permute(0, 2, 1, 3)
    scores = Q_h @ K_h.transpose(-2, -1) / (head_dim ** 0.5)
    weights = softmax(scores, dim=-1)
    out = weights @ V_h
    return out.permute(0, 2, 1, 3)


# ── Test harness (do not modify below this line) ──────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(13)

    batch, seq_len, num_q_heads, num_kv_heads, head_dim = 2, 6, 8, 2, 8

    Q = torch.randn(batch, seq_len, num_q_heads, head_dim)
    K = torch.randn(batch, seq_len, num_kv_heads, head_dim)
    V = torch.randn(batch, seq_len, num_kv_heads, head_dim)

    out = grouped_query_attention(Q, K, V, num_kv_heads)

    # ── Test 1: type and shape ─────────────────────────────────────────────────
    assert out is not None, "Function returned None — did you forget to return?"
    assert isinstance(out, torch.Tensor), f"Expected torch.Tensor, got {type(out)}"
    assert out.shape == (batch, seq_len, num_q_heads, head_dim), (
        f"Shape wrong: expected ({batch}, {seq_len}, {num_q_heads}, {head_dim}), got {out.shape}"
    )

    # ── Test 2: numerical match vs reference implementation ────────────────────
    def _ref(Q, K, V, num_kv_heads):
        _, _, num_q_h, head_dim = Q.shape
        groups = num_q_h // num_kv_heads
        K_exp = K.repeat_interleave(groups, dim=2)
        V_exp = V.repeat_interleave(groups, dim=2)
        Q_h = Q.permute(0, 2, 1, 3)
        K_h = K_exp.permute(0, 2, 1, 3)
        V_h = V_exp.permute(0, 2, 1, 3)
        scores = Q_h @ K_h.transpose(-2, -1) / (head_dim ** 0.5)
        s_max = scores.max(dim=-1, keepdim=True).values
        w = torch.exp(scores - s_max)
        w = w / w.sum(dim=-1, keepdim=True)
        return (w @ V_h).permute(0, 2, 1, 3)

    expected = _ref(Q, K, V, num_kv_heads)
    assert torch.allclose(out, expected, atol=1e-5), (
        f"Numerical mismatch vs reference. Max diff: {torch.max(torch.abs(out - expected)):.2e}"
    )

    # ── Test 3: F.scaled_dot_product_attention parity (built-in check) ─────────
    _g = num_q_heads // num_kv_heads
    _Ke = K.repeat_interleave(_g, dim=2).permute(0, 2, 1, 3)
    _Ve = V.repeat_interleave(_g, dim=2).permute(0, 2, 1, 3)
    _Qh = Q.permute(0, 2, 1, 3)
    expected_builtin = F.scaled_dot_product_attention(_Qh, _Ke, _Ve).permute(0, 2, 1, 3)
    assert torch.allclose(out, expected_builtin, atol=1e-4), (
        f"Mismatch vs F.scaled_dot_product_attention. Max diff: {torch.max(torch.abs(out - expected_builtin)):.2e}"
    )

    # ── Test 4: MQA case (G=1) matches reference ──────────────────────────────
    torch.manual_seed(37)
    K_one = torch.randn(batch, seq_len, 1, head_dim)
    V_one = torch.randn(batch, seq_len, 1, head_dim)
    out_mqa = grouped_query_attention(Q, K_one, V_one, num_kv_heads=1)
    assert out_mqa.shape == (batch, seq_len, num_q_heads, head_dim), (
        f"MQA output shape wrong: {out_mqa.shape}"
    )
    assert torch.allclose(out_mqa, _ref(Q, K_one, V_one, 1), atol=1e-5), (
        "GQA with num_kv_heads=1 (MQA) does not match reference"
    )

    # ── Test 5: MHA case (G=H) matches reference ──────────────────────────────
    torch.manual_seed(51)
    K_mha = torch.randn(batch, seq_len, num_q_heads, head_dim)
    V_mha = torch.randn(batch, seq_len, num_q_heads, head_dim)
    out_mha = grouped_query_attention(Q, K_mha, V_mha, num_kv_heads=num_q_heads)
    assert torch.allclose(out_mha, _ref(Q, K_mha, V_mha, num_q_heads), atol=1e-5), (
        "GQA with num_kv_heads=num_q_heads (MHA) does not match reference"
    )

    # ── Test 6: wrong-implementation detector — must use K ────────────────────
    torch.manual_seed(99)
    K_alt = torch.randn_like(K)
    out_alt = grouped_query_attention(Q, K_alt, V, num_kv_heads)
    assert not torch.allclose(out, out_alt, atol=1e-4), (
        "Output did not change when K was replaced — are you attending to K?"
    )

    print("All tests passed!")
    print(f"Output shape:          {out.shape}")
    print(f"Max diff vs reference: {torch.max(torch.abs(out - expected)):.2e}  (should be ~0)")
    print(f"MQA / MHA shapes:      {out_mqa.shape}  /  {out_mha.shape}")
`,
  },
  {
    id: 'swiglu-ffn',
    title: 'SwiGLU Feed-Forward Network',
    module: 'Transformer Layers',
    difficulty: 'intermediate',
    language: 'python',
    tags: ['torch', 'activation function', 'feed-forward', 'gating', 'transformer'],
    description: `SwiGLU is the feed-forward activation powering LLaMA, PaLM, Mistral, and Gemma — it replaces the original ReLU FFN from "Attention Is All You Need" with a gated structure that learns which features to suppress at each token position (Shazeer, "GLU Variants Improve Transformer", 2020).

The core insight: two independent linear projections of the input are computed — a "gate" branch and an "up" branch. The gate is squashed through the Swish/SiLU activation (a smooth, self-gated non-linearity), then element-wise multiplied with the unactivated up branch. This multiplicative gating lets each neuron selectively amplify or suppress information before the final down-projection back to d_model.

┌────────────────────────────────────────────────────────────────────────┐
│  SwiGLU(x)  =  ( SiLU(x @ W_gate) ⊙ (x @ W_up) ) @ W_down             │
│  where  SiLU(z) = z · σ(z)  =  z / (1 + exp(−z))                       │
└────────────────────────────────────────────────────────────────────────┘

📋 Tensor Reference Table:
  +----------+----------------------------------+---------------------+
  | Tensor   | Description                      | Shape               |
  +----------+----------------------------------+---------------------+
  | x        | input token embeddings           | (batch, d_model)    |
  | W_gate   | gate projection weight           | (d_model, d_hidden) |
  | W_up     | up projection weight             | (d_model, d_hidden) |
  | W_down   | down projection weight           | (d_hidden, d_model) |
  | gate     | pre-activation gate values       | (batch, d_hidden)   |
  | up       | unactivated up projection        | (batch, d_hidden)   |
  | hidden   | SiLU(gate) ⊙ up                 | (batch, d_hidden)   |
  | output   | final result                     | (batch, d_model)    |
  +----------+----------------------------------+---------------------+

  x (batch, d_model)
    ├──→ @ W_gate ──→ SiLU(·) ──┐
    │                            ⊙ ──→ hidden ──→ @ W_down ──→ output
    └──→ @ W_up  ───────────────┘
                              (batch, d_hidden)        (batch, d_model)

Steps:
  1. Compute gate = x @ W_gate                → shape (batch, d_hidden)
  2. Compute up   = x @ W_up                 → shape (batch, d_hidden)
  3. Apply gating: hidden = silu(gate) ⊙ up  → shape (batch, d_hidden)  [element-wise ×]
  4. Down-project: output = hidden @ W_down  → shape (batch, d_model)

Requirements:
  • Use only PyTorch (torch and torch.nn.functional).
  • silu is provided — call it, do not reimplement it.
  • Output shape must be (batch_size, d_model) matching the input.
  • Both W_gate and W_up must be used as independent projections.`,

    staticHint: `Think of the data flow as a fork-then-merge: x is projected twice independently before the results are combined.

The gate branch:
  gate  = x @ W_gate   # (batch, d_hidden) — will be squashed by SiLU
  gated = silu(gate)   # SiLU(z) = z * sigmoid(z) — smooth, allows negative pass-through

The up branch needs no activation — it is a plain linear projection:
  up = x @ W_up        # (batch, d_hidden)

How do you combine two tensors of the same shape element-wise in PyTorch?
Both gated and up are (batch, d_hidden), so the ⊙ symbol means exactly what you think.

After combining, there is one more step before you have the final output.
What shape does hidden have, and which weight gets you back to (batch, d_model)?`,

    starterCode: `import torch
import torch.nn.functional as F


# ── Provided helper (do not modify) ───────────────────────────────────────────

def silu(x: torch.Tensor) -> torch.Tensor:
    """Swish / SiLU activation: silu(x) = x * sigmoid(x). Provided — do not modify."""
    return x * torch.sigmoid(x)


def swiglu_ffn(
    x: torch.Tensor,
    W_gate: torch.Tensor,
    W_up: torch.Tensor,
    W_down: torch.Tensor,
) -> torch.Tensor:
    """
    SwiGLU feed-forward block.

    SwiGLU(x) = ( SiLU(x @ W_gate) ⊙ (x @ W_up) ) @ W_down

    Args:
        x:      Input tensor of shape (batch_size, d_model).
        W_gate: Gate projection weight of shape (d_model, d_hidden).
        W_up:   Up projection weight of shape (d_model, d_hidden).
        W_down: Down projection weight of shape (d_hidden, d_model).

    Returns:
        Output tensor of shape (batch_size, d_model).
    """
    # YOUR CODE HERE
    pass


# ── Test harness (do not modify below this line) ──────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(42)

    batch_size, d_model, d_hidden = 4, 16, 32

    x      = torch.randn(batch_size, d_model)
    W_gate = torch.randn(d_model, d_hidden)
    W_up   = torch.randn(d_model, d_hidden)
    W_down = torch.randn(d_hidden, d_model)

    out = swiglu_ffn(x, W_gate, W_up, W_down)

    # ── Test 1: type and shape ─────────────────────────────────────────────────
    assert out is not None, "Function returned None — did you forget to return?"
    assert isinstance(out, torch.Tensor), f"Expected torch.Tensor, got {type(out)}"
    assert out.shape == (batch_size, d_model), (
        f"Shape wrong: expected ({batch_size}, {d_model}), got {out.shape}"
    )

    # Reference implementation (uses F.silu — PyTorch built-in SiLU as parity check)
    def _ref(x, W_gate, W_up, W_down):
        return (F.silu(x @ W_gate) * (x @ W_up)) @ W_down

    expected = _ref(x, W_gate, W_up, W_down)
    assert torch.allclose(out, expected, atol=1e-6), (
        f"Numerical mismatch vs reference. Max diff: {torch.max(torch.abs(out - expected)):.2e}"
    )

    # ── Test 2: zero input produces zero output ────────────────────────────────
    x_zero   = torch.zeros(batch_size, d_model)
    out_zero = swiglu_ffn(x_zero, W_gate, W_up, W_down)
    assert torch.allclose(out_zero, torch.zeros(batch_size, d_model), atol=1e-6), (
        "Zero input should produce zero output — both projections should multiply through x"
    )

    # ── Test 3: single-token batch (edge case) ─────────────────────────────────
    x_single   = torch.randn(1, d_model)
    out_single = swiglu_ffn(x_single, W_gate, W_up, W_down)
    assert out_single.shape == (1, d_model), (
        f"Single-token shape wrong: expected (1, {d_model}), got {out_single.shape}"
    )

    # ── Test 4: W_gate must be used (wrong-implementation detector) ────────────
    W_gate_alt = torch.randn(d_model, d_hidden)
    out_alt    = swiglu_ffn(x, W_gate_alt, W_up, W_down)
    assert not torch.allclose(out, out_alt), (
        "Output did not change when W_gate was replaced — are you using W_gate to compute the gate?"
    )

    # ── Test 5: W_up must be used as an independent projection ─────────────────
    W_up_alt   = torch.randn(d_model, d_hidden)
    out_up_alt = swiglu_ffn(x, W_gate, W_up_alt, W_down)
    assert not torch.allclose(out, out_up_alt), (
        "Output did not change when W_up was replaced — are you using W_up as a separate projection from W_gate?"
    )

    print("All tests passed!")
    print(f"Output shape: {out.shape}")
    print(f"Max absolute output value: {out.abs().max():.4f}")
    print(f"Mean SiLU gate activation: {F.silu(x @ W_gate).mean():.4f}")
`,

    solutionCode: `import torch
import torch.nn.functional as F


# ── Provided helper (do not modify) ───────────────────────────────────────────

def silu(x: torch.Tensor) -> torch.Tensor:
    """Swish / SiLU activation: silu(x) = x * sigmoid(x). Provided — do not modify."""
    return x * torch.sigmoid(x)


def swiglu_ffn(
    x: torch.Tensor,
    W_gate: torch.Tensor,
    W_up: torch.Tensor,
    W_down: torch.Tensor,
) -> torch.Tensor:
    """
    SwiGLU feed-forward block.

    SwiGLU(x) = ( SiLU(x @ W_gate) ⊙ (x @ W_up) ) @ W_down

    Args:
        x:      Input tensor of shape (batch_size, d_model).
        W_gate: Gate projection weight of shape (d_model, d_hidden).
        W_up:   Up projection weight of shape (d_model, d_hidden).
        W_down: Down projection weight of shape (d_hidden, d_model).

    Returns:
        Output tensor of shape (batch_size, d_model).
    """
    gate   = x @ W_gate
    up     = x @ W_up
    hidden = silu(gate) * up
    return hidden @ W_down


# ── Test harness (do not modify below this line) ──────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(42)

    batch_size, d_model, d_hidden = 4, 16, 32

    x      = torch.randn(batch_size, d_model)
    W_gate = torch.randn(d_model, d_hidden)
    W_up   = torch.randn(d_model, d_hidden)
    W_down = torch.randn(d_hidden, d_model)

    out = swiglu_ffn(x, W_gate, W_up, W_down)

    # ── Test 1: type and shape ─────────────────────────────────────────────────
    assert out is not None, "Function returned None — did you forget to return?"
    assert isinstance(out, torch.Tensor), f"Expected torch.Tensor, got {type(out)}"
    assert out.shape == (batch_size, d_model), (
        f"Shape wrong: expected ({batch_size}, {d_model}), got {out.shape}"
    )

    # Reference implementation (uses F.silu — PyTorch built-in SiLU as parity check)
    def _ref(x, W_gate, W_up, W_down):
        return (F.silu(x @ W_gate) * (x @ W_up)) @ W_down

    expected = _ref(x, W_gate, W_up, W_down)
    assert torch.allclose(out, expected, atol=1e-6), (
        f"Numerical mismatch vs reference. Max diff: {torch.max(torch.abs(out - expected)):.2e}"
    )

    # ── Test 2: zero input produces zero output ────────────────────────────────
    x_zero   = torch.zeros(batch_size, d_model)
    out_zero = swiglu_ffn(x_zero, W_gate, W_up, W_down)
    assert torch.allclose(out_zero, torch.zeros(batch_size, d_model), atol=1e-6), (
        "Zero input should produce zero output — both projections should multiply through x"
    )

    # ── Test 3: single-token batch (edge case) ─────────────────────────────────
    x_single   = torch.randn(1, d_model)
    out_single = swiglu_ffn(x_single, W_gate, W_up, W_down)
    assert out_single.shape == (1, d_model), (
        f"Single-token shape wrong: expected (1, {d_model}), got {out_single.shape}"
    )

    # ── Test 4: W_gate must be used (wrong-implementation detector) ────────────
    W_gate_alt = torch.randn(d_model, d_hidden)
    out_alt    = swiglu_ffn(x, W_gate_alt, W_up, W_down)
    assert not torch.allclose(out, out_alt), (
        "Output did not change when W_gate was replaced — are you using W_gate to compute the gate?"
    )

    # ── Test 5: W_up must be used as an independent projection ─────────────────
    W_up_alt   = torch.randn(d_model, d_hidden)
    out_up_alt = swiglu_ffn(x, W_gate, W_up_alt, W_down)
    assert not torch.allclose(out, out_up_alt), (
        "Output did not change when W_up was replaced — are you using W_up as a separate projection from W_gate?"
    )

    print("All tests passed!")
    print(f"Output shape: {out.shape}")
    print(f"Max absolute output value: {out.abs().max():.4f}")
    print(f"Mean SiLU gate activation: {F.silu(x @ W_gate).mean():.4f}")
`,
  },
  {
    id: 'conv2d-forward',
    title: '2D Convolution (Conv2d)',
    module: 'Multimodal Models',
    difficulty: 'intermediate',
    language: 'python',
    tags: ['torch', 'convolution', 'vision', 'patch embedding', 'multimodal'],
    visualization: Conv2dVisualization,
    description: `2D convolution slides a learnable kernel over an image to detect local spatial patterns — and in Vision Transformers, a strided Conv2d with kernel_size=patch_size converts an entire image into a sequence of patch tokens fed to the transformer encoder (Dosovitskiy et al., "An Image is Worth 16×16 Words", 2021).

For each output channel and each output position (h, w), the result is the dot product between the kernel and the aligned receptive field patch in the input, summed across all input channels:

┌──────────────────────────────────────────────────────────────────────────┐
│  out[b, co, h, w] = bias[co]                                              │
│    + Σ_{ci, kh, kw}  x[b, ci, h·s+kh, w·s+kw] × K[co, ci, kh, kw]       │
│                                                                            │
│  H_out = (H_in − kH) // stride + 1                                        │
│  W_out = (W_in − kW) // stride + 1                                        │
└──────────────────────────────────────────────────────────────────────────┘

📋 Tensor Reference Table:
  +----------+----------------------------------------------+------------------------------+
  | Tensor   | Description                                  | Shape                        |
  +----------+----------------------------------------------+------------------------------+
  | x        | input feature map (image or features)        | (batch, C_in, H_in, W_in)    |
  | kernel   | learnable filter weights                     | (C_out, C_in, kH, kW)        |
  | bias     | per-output-channel offset                    | (C_out,)                     |
  | unfolded | all receptive field patches as columns       | (batch, C_in·kH·kW, L)       |
  | w_flat   | kernel reshaped for matmul                   | (C_out, C_in·kH·kW)          |
  | output   | convolved result                             | (batch, C_out, H_out, W_out) |
  +----------+----------------------------------------------+------------------------------+

(L = H_out × W_out = total number of output positions)

An interactive, animated kernel-sliding visualization is available above — watch the cyan receptive field sweep across the input as the amber output cell is computed, and use the stride selector to see how stride shrinks the output grid.

Steps:
  1. Compute output dimensions: H_out = (H_in − kH) // stride + 1, W_out = (W_in − kW) // stride + 1
  2. Extract all receptive fields simultaneously:
       unfolded = F.unfold(x, kernel_size=(kH, kW), stride=stride)   → (batch, C_in·kH·kW, L)
  3. Flatten kernel weights:
       w_flat = kernel.reshape(C_out, −1)                            → (C_out, C_in·kH·kW)
  4. Batch matrix multiply — all output values at once:
       out_flat = w_flat.unsqueeze(0) @ unfolded                     → (batch, C_out, L)
  5. Add bias and reshape:
       (out_flat + bias.view(1, C_out, 1)).reshape(batch, C_out, H_out, W_out)

Requirements:
  • Use only PyTorch (torch and torch.nn.functional are available).
  • Output shape must be (batch, C_out, H_out, W_out).
  • No padding — all tests use valid convolution (output smaller than input).
  • Tip: F.unfold converts the sliding-window loop into a single matrix multiply.`,

    staticHint: `The key insight: every 2D convolution is a matrix multiply in disguise.

What if you could collect all the receptive field patches as columns of one big matrix?
  unfolded = F.unfold(x, kernel_size=(kH, kW), stride=stride)
  # shape: (batch, C_in * kH * kW, H_out * W_out)
  # each column is a single flattened patch from the input

Now if you flatten kernel to (C_out, C_in * kH * kW), what does
  w_flat.unsqueeze(0) @ unfolded
give you in terms of shape and meaning?

After that matmul you have all output values but not yet the right shape.
Where does bias fit in, and what reshape turns (batch, C_out, H_out*W_out)
back into (batch, C_out, H_out, W_out)?`,

    starterCode: `import torch
import torch.nn.functional as F


def conv2d_forward(
    x: torch.Tensor,
    kernel: torch.Tensor,
    bias: torch.Tensor,
    stride: int = 1,
) -> torch.Tensor:
    """
    2D convolution forward pass (valid convolution, no padding).

    out[b, co, h, w] = bias[co]
        + sum over ci, kh, kw: x[b, ci, h*s+kh, w*s+kw] * kernel[co, ci, kh, kw]

    Args:
        x:      Input tensor of shape (batch, C_in, H_in, W_in).
        kernel: Filter weights of shape (C_out, C_in, kH, kW).
        bias:   Per-output-channel bias of shape (C_out,).
        stride: Kernel step size (default 1).

    Returns:
        Output tensor of shape (batch, C_out, H_out, W_out)
        where H_out = (H_in - kH) // stride + 1
              W_out = (W_in - kW) // stride + 1
    """
    # YOUR CODE HERE
    pass


# ── Test harness (do not modify below this line) ──────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(0)

    batch, C_in, H_in, W_in = 2, 3, 7, 7
    C_out, kH, kW = 4, 3, 3
    stride = 1

    x      = torch.randn(batch, C_in, H_in, W_in)
    kernel = torch.randn(C_out, C_in, kH, kW)
    bias   = torch.randn(C_out)

    out = conv2d_forward(x, kernel, bias, stride)

    # ── Test 1: type and shape ─────────────────────────────────────────────────
    assert out is not None, "Function returned None — did you forget to return?"
    assert isinstance(out, torch.Tensor), f"Expected torch.Tensor, got {type(out)}"
    H_out = (H_in - kH) // stride + 1
    W_out = (W_in - kW) // stride + 1
    assert out.shape == (batch, C_out, H_out, W_out), (
        f"Shape wrong: expected ({batch}, {C_out}, {H_out}, {W_out}), got {out.shape}"
    )

    # Reference: PyTorch built-in F.conv2d (built-in parity check)
    expected = F.conv2d(x, kernel, bias, stride=stride)
    assert torch.allclose(out, expected, atol=1e-5), (
        f"Numerical mismatch vs F.conv2d. Max diff: {torch.max(torch.abs(out - expected)):.2e}"
    )

    # ── Test 2: 1×1 identity kernel returns input unchanged ───────────────────
    x_id      = torch.randn(1, 1, 4, 4)
    kernel_id = torch.ones(1, 1, 1, 1)
    bias_id   = torch.zeros(1)
    out_id    = conv2d_forward(x_id, kernel_id, bias_id, stride=1)
    assert out_id.shape == (1, 1, 4, 4), (
        f"1×1 kernel should preserve spatial dims: got {out_id.shape}"
    )
    assert torch.allclose(out_id, x_id, atol=1e-6), (
        "1×1 all-ones kernel + zero bias should return the input unchanged"
    )

    # ── Test 3: zero input → output equals bias broadcast ─────────────────────
    x_zero   = torch.zeros(batch, C_in, H_in, W_in)
    out_zero = conv2d_forward(x_zero, kernel, bias, stride)
    expected_zero = bias.view(1, C_out, 1, 1).expand(batch, C_out, H_out, W_out)
    assert torch.allclose(out_zero, expected_zero, atol=1e-6), (
        "Zero input should produce output equal to bias at every spatial position"
    )

    # ── Test 4: stride=2 produces correct shape and values ────────────────────
    out_s2 = conv2d_forward(x, kernel, bias, stride=2)
    H_out2 = (H_in - kH) // 2 + 1
    W_out2 = (W_in - kW) // 2 + 1
    assert out_s2.shape == (batch, C_out, H_out2, W_out2), (
        f"Stride=2 shape wrong: expected ({batch},{C_out},{H_out2},{W_out2}), got {out_s2.shape}"
    )
    expected_s2 = F.conv2d(x, kernel, bias, stride=2)
    assert torch.allclose(out_s2, expected_s2, atol=1e-5), (
        f"Stride=2 mismatch vs F.conv2d. Max diff: {torch.max(torch.abs(out_s2 - expected_s2)):.2e}"
    )

    # ── Test 5: kernel detector (wrong-implementation detector) ───────────────
    kernel_alt = torch.randn(C_out, C_in, kH, kW)
    out_alt    = conv2d_forward(x, kernel_alt, bias, stride)
    assert not torch.allclose(out, out_alt), (
        "Output did not change when kernel was replaced — are you applying the kernel weights?"
    )

    print("All tests passed!")
    print(f"Output shape: {out.shape}")
    print(f"Max diff vs F.conv2d: {torch.max(torch.abs(out - expected)):.2e}  (should be ~0)")
    print(f"Stride=2 output shape: {out_s2.shape}")
`,

    solutionCode: `import torch
import torch.nn.functional as F


def conv2d_forward(
    x: torch.Tensor,
    kernel: torch.Tensor,
    bias: torch.Tensor,
    stride: int = 1,
) -> torch.Tensor:
    """
    2D convolution forward pass (valid convolution, no padding).

    out[b, co, h, w] = bias[co]
        + sum over ci, kh, kw: x[b, ci, h*s+kh, w*s+kw] * kernel[co, ci, kh, kw]

    Args:
        x:      Input tensor of shape (batch, C_in, H_in, W_in).
        kernel: Filter weights of shape (C_out, C_in, kH, kW).
        bias:   Per-output-channel bias of shape (C_out,).
        stride: Kernel step size (default 1).

    Returns:
        Output tensor of shape (batch, C_out, H_out, W_out)
        where H_out = (H_in - kH) // stride + 1
              W_out = (W_in - kW) // stride + 1
    """
    batch, C_in, H_in, W_in = x.shape
    C_out, _, kH, kW = kernel.shape
    H_out = (H_in - kH) // stride + 1
    W_out = (W_in - kW) // stride + 1

    unfolded = F.unfold(x, kernel_size=(kH, kW), stride=stride)
    w_flat   = kernel.reshape(C_out, -1)
    out_flat = w_flat.unsqueeze(0) @ unfolded
    out_flat = out_flat + bias.view(1, C_out, 1)
    return out_flat.reshape(batch, C_out, H_out, W_out)


# ── Test harness (do not modify below this line) ──────────────────────────────

if __name__ == "__main__":
    torch.manual_seed(0)

    batch, C_in, H_in, W_in = 2, 3, 7, 7
    C_out, kH, kW = 4, 3, 3
    stride = 1

    x      = torch.randn(batch, C_in, H_in, W_in)
    kernel = torch.randn(C_out, C_in, kH, kW)
    bias   = torch.randn(C_out)

    out = conv2d_forward(x, kernel, bias, stride)

    # ── Test 1: type and shape ─────────────────────────────────────────────────
    assert out is not None, "Function returned None — did you forget to return?"
    assert isinstance(out, torch.Tensor), f"Expected torch.Tensor, got {type(out)}"
    H_out = (H_in - kH) // stride + 1
    W_out = (W_in - kW) // stride + 1
    assert out.shape == (batch, C_out, H_out, W_out), (
        f"Shape wrong: expected ({batch}, {C_out}, {H_out}, {W_out}), got {out.shape}"
    )

    # Reference: PyTorch built-in F.conv2d (built-in parity check)
    expected = F.conv2d(x, kernel, bias, stride=stride)
    assert torch.allclose(out, expected, atol=1e-5), (
        f"Numerical mismatch vs F.conv2d. Max diff: {torch.max(torch.abs(out - expected)):.2e}"
    )

    # ── Test 2: 1×1 identity kernel returns input unchanged ───────────────────
    x_id      = torch.randn(1, 1, 4, 4)
    kernel_id = torch.ones(1, 1, 1, 1)
    bias_id   = torch.zeros(1)
    out_id    = conv2d_forward(x_id, kernel_id, bias_id, stride=1)
    assert out_id.shape == (1, 1, 4, 4), (
        f"1×1 kernel should preserve spatial dims: got {out_id.shape}"
    )
    assert torch.allclose(out_id, x_id, atol=1e-6), (
        "1×1 all-ones kernel + zero bias should return the input unchanged"
    )

    # ── Test 3: zero input → output equals bias broadcast ─────────────────────
    x_zero   = torch.zeros(batch, C_in, H_in, W_in)
    out_zero = conv2d_forward(x_zero, kernel, bias, stride)
    expected_zero = bias.view(1, C_out, 1, 1).expand(batch, C_out, H_out, W_out)
    assert torch.allclose(out_zero, expected_zero, atol=1e-6), (
        "Zero input should produce output equal to bias at every spatial position"
    )

    # ── Test 4: stride=2 produces correct shape and values ────────────────────
    out_s2 = conv2d_forward(x, kernel, bias, stride=2)
    H_out2 = (H_in - kH) // 2 + 1
    W_out2 = (W_in - kW) // 2 + 1
    assert out_s2.shape == (batch, C_out, H_out2, W_out2), (
        f"Stride=2 shape wrong: expected ({batch},{C_out},{H_out2},{W_out2}), got {out_s2.shape}"
    )
    expected_s2 = F.conv2d(x, kernel, bias, stride=2)
    assert torch.allclose(out_s2, expected_s2, atol=1e-5), (
        f"Stride=2 mismatch vs F.conv2d. Max diff: {torch.max(torch.abs(out_s2 - expected_s2)):.2e}"
    )

    # ── Test 5: kernel detector (wrong-implementation detector) ───────────────
    kernel_alt = torch.randn(C_out, C_in, kH, kW)
    out_alt    = conv2d_forward(x, kernel_alt, bias, stride)
    assert not torch.allclose(out, out_alt), (
        "Output did not change when kernel was replaced — are you applying the kernel weights?"
    )

    print("All tests passed!")
    print(f"Output shape: {out.shape}")
    print(f"Max diff vs F.conv2d: {torch.max(torch.abs(out - expected)):.2e}  (should be ~0)")
    print(f"Stride=2 output shape: {out_s2.shape}")
`,
  },
]
