---
name: new-challenge
description: >-
  Create a new LayerForge coding challenge on the topic: $ARGUMENTS
---

# new-challenge

Create a new LayerForge coding challenge on the topic: **$ARGUMENTS**

Work through every phase below in order. Do not skip any phase or proceed to the next before the current one is complete.

---

## Phase 1 — Research the Topic

Use WebSearch and WebFetch to gather:

1. **The original paper or authoritative spec** — search `"$ARGUMENTS" arxiv` or `"$ARGUMENTS" paper`. Read the relevant sections (abstract, method, equations). Extract the exact formula with notation.
2. **A canonical industrial implementation** — search `pytorch "$ARGUMENTS" source` or `"$ARGUMENTS" numpy implementation github`. Fetch and read actual source code (PyTorch ATen/nn, HuggingFace transformers, JAX Flax, etc.). Note the exact sequence of tensor operations.
3. **One high-quality tutorial or blog post** — search `"$ARGUMENTS" explained` or `"illustrated $ARGUMENTS"`. Read it. Note any diagrams, intuitions, or common mistakes it highlights.

From your research, extract and record:
- The mathematical formula(s) with exact variable names and notation
- The shape of every input and output tensor, and what each dimension represents
- The algorithm as an ordered list of tensor operations (typically 3–8 steps)
- Any numerical stability tricks (e.g. subtract max before softmax, add epsilon before sqrt)
- Known gotchas — subtle implementation details that differ from the naive formula
- The conceptual intuition: *why* does this operation work the way it does?

---

## Phase 1b — Module Placement Research

Read `apps/study/src/data/challenges.ts` in full and collect every distinct `module` string currently in the array.

**Decision tree — work through it top to bottom, stop at the first match:**

### Step A — Try to fit an existing module

For each existing module ask: *Is this topic a component, variant, or direct extension of what that module already covers?*

- If **yes, clearly** → assign that module. Record which one and why. Skip to Phase 2.
- If **no, or uncertain** → continue to Step B.

### Step B — Research the LLM/ML taxonomy online

The goal is to find out whether the modern research or engineering community has an established category for this topic. Run all of the following searches and fetch the most relevant pages:

1. `"$ARGUMENTS" site:arxiv.org` — find the paper(s) that introduced or survey this concept. Read the section/chapter headings to see how the authors categorize it.
2. `"$ARGUMENTS" transformer components taxonomy` — look for survey papers or blog posts that place this in a broader taxonomy (e.g. "Efficient Transformers: A Survey", "A Survey of Large Language Models").
3. `"$ARGUMENTS" site:github.com huggingface OR eleutherai OR stanford` — look at how leading open-source LLM codebases organise their source trees. A module name used in real codebases carries more weight than one invented ad hoc.
4. `"$ARGUMENTS" llm engineering course curriculum` — check how ML educators (fast.ai, Karpathy's makemore/nanoGPT lectures, MIT 6.S191, Stanford CS224N) group topics in their syllabi.

From this research, record:
- The canonical category name used in ≥ 2 independent sources
- Whether the category is a sub-area of an existing module (supporting merge) or genuinely distinct (supporting a new module)
- 2–3 example topics that would also belong to this category (validates the category is broad enough to hold future challenges)

### Step C — Make the placement decision

Use the research to choose **one** of:

| Outcome | Condition | Action |
|---|---|---|
| **Use existing module** | Research shows the topic is a variant/component of an existing module's subject area | Set `module` to the matching existing string |
| **Create new module** | ≥ 2 independent sources use a distinct category name that doesn't map to any existing module | Set `module` to that research-backed name (Title Case) |
| **Create new module (novel)** | Topic is too new for consensus naming, but clearly belongs to a distinct area | Derive a short, precise module name from the paper/codebase terminology; note the rationale in your reasoning |

**Naming rules for new modules:**
- Use Title Case and noun phrases, e.g. "Positional Encoding", "Efficient Attention", "Training Stability", "Mixture of Experts"
- Prefer names that appear verbatim in at least one paper title, survey section heading, or major codebase directory
- Must be broad enough to contain ≥ 3 plausible future challenges (if you can't name 3, it's too narrow — merge up)
- Must be distinct enough that it wouldn't overlap with an existing module's subject area

Document your final decision and its evidence before moving on.

---

## Phase 2 — Design the Challenge

Read `apps/study/src/data/challenges.ts` in full. Note:
- Which helper functions are already defined in existing starter codes (softmax, scaled_dot_product_attention, layer_norm, etc.) — these can be re-provided as "provided — do not modify" in the new challenge
- The `module` field is already decided from Phase 1b — use that value exactly
- The overall difficulty progression — don't make a challenge easier than its prerequisites

Design decisions to make:

**Scope**: one self-contained mathematical operation. If the research covers a large system, identify the single most instructive sub-operation and focus on that.

**Difficulty**: assign based on the following rubric:
- `beginner`: ≤ 2 algorithmic steps, all operations are standard linear algebra (matmul, add), no reshaping tricks required
- `intermediate`: 3–5 steps, requires one non-obvious NumPy trick (keepdims, reshape+transpose, einsum, masked fill, etc.)
- `advanced`: 5+ steps, or involves a genuinely subtle insight (e.g. causal masking, rotary embeddings, gradient-friendly formulation), or builds non-trivially on a previous intermediate challenge

**Function signature**: design one primary function. Provide any needed helpers (with their correct implementations) as clearly marked "do not modify" blocks above it. This lets the user focus exclusively on the target concept.

**Test strategy** — plan 4–6 assertions that collectively verify:
1. Return type (`isinstance(out, np.ndarray)`) and shape
2. Numerical correctness vs. an embedded reference implementation using `np.allclose`
3. At least one edge/boundary case (e.g. zero input, identity weights, single token)
4. At least one "wrong implementation detector" — change a key input and assert the output changes (catches implementations that ignore a parameter)
5. Any invariant the operation must satisfy (e.g. attention weights sum to 1, output norm properties)

---

## Phase 3 — Write the Challenge Fields

### 3a. `description` (plain text, automatically parsed and styled by DescriptionRenderer)

Structure it in this order:
1. **One-sentence hook** — what this operation does and why it appears in transformers/modern ML systems. Cite the paper inline if relevant.
2. **Key Formulas** — Wrap all closed-form mathematical equations and rotary formulas in a beautiful unicode box-drawing block (using `┌───` and `└───` lines with `│` vertical borders). The `DescriptionRenderer` will automatically parse and render them as gorgeous gradient-based formula cards with glowing cyan borders. Example:
   ```
   ┌──────────────────────────────────────────────────────────────────┐
   │  x_rot  =  x · cos_emb  +  rotate_half(x) · sin_emb              │
   └──────────────────────────────────────────────────────────────────┘
   ```
3. **Tensor Reference Table** — Always document all variables, tensors, descriptions, and shapes inside an ASCII grid table (using `+---` and `|` characters). The `DescriptionRenderer` will automatically parse these into beautiful, high-fidelity responsive HTML tables with styled cyan variable names and monospace shape badges. Example:
   ```
   📋 Tensor Reference Table:
     +------------+------------------------------------+---------------------+
     | Tensor     | Description                        | Shape               |
     +------------+------------------------------------+---------------------+
     | x          | query or key matrix                | (seq_len, d_head)   |
     +------------+------------------------------------+---------------------+
   ```
4. **Data-flow diagram** — If the challenge has a `visualization` component, do NOT include a plain-text ASCII data-flow diagram in the description. Instead, implement a highly polished, interactive, animated graphical flowchart (using SVG node flows with animated flow arrows and hover-sensitive explanation cards) directly inside the visualizer component at the bottom, and replace the plain-text diagram in the description with a clean textual callout to the interactive visualizer. Otherwise, for purely text-based challenges with non-trivial tensor manipulation (reshape, split, concat), include an ASCII data-flow diagram. Example ASCII style:
   ```
     Q (seq, d_model) ──→ @ W_q ──→ split ──→ (h, seq, d_k) ──┐
     K (seq, d_model) ──→ @ W_k ──→ split ──→ (h, seq, d_k) ──┼──→ Attn ──→ concat ──→ @ W_o ──→ out
     V (seq, d_model) ──→ @ W_v ──→ split ──→ (h, seq, d_k) ──┘
   ```
5. **Step-by-step algorithm** — prefix with "Steps:" and list numbered steps (e.g. `1. `, `2. `) matching the diagram, one tensor operation per step with its input/output shape. The `DescriptionRenderer` will parse them into vertical step list cards with glowing purple circular badges.
6. **Requirements** — prefix with "Requirements:" and list constraints starting with bullet points (e.g. `• `). The `DescriptionRenderer` will parse them into a premium emerald-accented callout panel with checkmark icons.

### 3b. `staticHint`

A Socratic hint that surfaces the key insight without giving the implementation:
- Open with a guiding question about the hardest step
- Show at most 4–5 lines of partial code illustrating *one* sub-step (not the full solution)
- End with a question or observation that redirects the user back to the problem
- Tone: senior engineer thinking out loud, not a tutorial

### 3c. `starterCode`

Write the complete Python source file. Follow this exact structure:

```python
import numpy as np
# other stdlib-only imports if needed (math, typing)


# ── Provided helpers (do not modify) ─────────────────────────────────────────
# Include correct implementations of any prerequisite functions needed.
# Each marked clearly: "Provided — do not modify."


def <primary_function>(<typed_args>) -> np.ndarray:
    """
    <One-line summary of what this computes.>

    <Formula in docstring, matching the description field.>

    Args:
        <arg>: <type hint and shape, e.g. "Query matrix of shape (seq_len, d_k)">
        ...
    Returns:
        <description>: shape (<dims>)
    """
    # YOUR CODE HERE
    pass


# ── Test harness (do not modify below this line) ──────────────────────────────

if __name__ == "__main__":
    np.random.seed(<pick a seed between 0 and 99>)

    # ── Test 1: <brief description> ───────────────────────────────────────────
    <setup>
    <call function>
    assert out is not None, "Function returned None — did you forget to return?"
    assert isinstance(out, np.ndarray), f"Expected np.ndarray, got {type(out)}"
    assert out.shape == (...), f"Shape wrong: expected ..., got {out.shape}"

    # Reference implementation for numerical comparison
    def _ref(<args>):
        <correct implementation, 5–15 lines>

    expected = _ref(...)
    assert np.allclose(out, expected, atol=1e-6), (
        f"Numerical mismatch. Max diff: {np.max(np.abs(out - expected)):.2e}"
    )

    # ── Test 2: <edge/boundary case> ─────────────────────────────────────────
    ...

    # ── Test 3: invariant check ───────────────────────────────────────────────
    ...

    # ── Test 4: wrong-implementation detector ────────────────────────────────
    <change a key parameter>
    out_changed = <call with changed param>
    assert not np.allclose(out, out_changed), (
        "Output did not change when <param> was replaced — are you using it?"
    )

    print("All tests passed!")
    print(f"Output shape: {out.shape}")
    print(f"<one or two informative lines about the output>")
```

Rules:
- Use `\\n` for newlines inside Python f-strings that appear inside the TypeScript template literal
- Escape every backtick inside the TypeScript template literal as `` \` `` — there must be none
- Every `assert` statement must include a descriptive string message
- The `_ref` function must be a correct implementation embedded directly in the test harness; it is the ground truth the user's code is compared against
- Seed must produce numerically stable test cases (run mentally or actually verify that `_ref` produces finite, non-NaN output)

---

## Phase 3b — Design the Visualization (decide, then build if warranted)

### When to add a visualization

Add a `visualization` component when **two or more** of these apply:
- The operation has geometric or cyclic structure (rotations, trigonometric, frequency-based)
- Understanding it requires watching a value change over a parameter range
- The tensor data-flow involves a non-trivial reshape/split/concat that is hard to picture from text
- A learner's most common mistake is misunderstanding *what* changes vs. what stays constant

Skip it if the challenge is purely algebraic (linear layer, softmax, layer norm) — ASCII diagrams and clear text are sufficient.

### What to show

Pick one primary phenomenon — the thing a learner needs to *see* to grasp the concept:

- **Geometric / frequency-based** (e.g. RoPE): animate the transformation over a parameter slider (position, time step, head index). Show multiple instances side-by-side so the learner sees the contrast between fast and slow rates.
- **Data-flow & Shapes**: For any challenge involving complex shapes, padding, splits, or tensor concatenations, implement a gorgeous interactive SVG-based flowchart at the bottom of the visualizer component (directly below any primary geometric/frequency phasors). Use glowing borders, responsive SVG elements, and CSS flow animations (`stroke-dasharray` keyframe offsets) on connection lines to make the data visually "flow" between operations.
- **Hover/Interaction Tooltips**: Add dynamic mouse-over or hover states to flowchart nodes that update a card at the bottom of the visualizer, showing the exact formula, current tensor shape, and active values calculated in real time matching the user's current slider positions (e.g. position index m, fraction p).
- **Attention patterns**: heatmap of the weight matrix, interactive (scrub over query positions).

### Implementation rules

1. **Create** `apps/study/src/visualizations/<CamelName>Visualization.tsx`
2. **Props**: none — hardcode constants matching the test harness (same `d_head`, `base`, seed, etc.)
3. **Self-contained**: React 18 + Tailwind v3 only. No external charting or animation libs.
4. **Interactive**: always include a play/pause toggle and a range-input scrubber for animated parameters. Let the learner pause and step through frame by frame.
5. **Compact**: target 220–280 px tall. Never push the description off-screen.
6. **Colour palette**: use the app's accent colours — `#22d3ee` cyan, `#a78bfa` purple, `#34d399` green, `#fb923c` amber — for up to 4 groups; `#374151` / `#1f2937` for backgrounds; `#6b7280` for labels.
7. **Caption**: end with a one-line `text-[10px] text-gray-600 text-center` paragraph stating the key takeaway the animation illustrates.

### Wiring into the challenge

After creating the component:

1. Import at the top of `challenges.ts`:
   ```typescript
   import { <Name>Visualization } from '../visualizations/<Name>Visualization'
   ```
2. Add `visualization: <Name>Visualization,` as a field in the challenge object (just before `description`).

`ChallengePage.tsx` already renders `challenge.visualization` above the description — no other changes needed.

---

## Phase 4 — Implement and Verify

Before writing any file, mentally (or in a scratch block) trace through the full implementation:

1. Write out the correct implementation of `<primary_function>`
2. Trace each test assertion with the correct implementation — every single one must pass
3. Confirm shapes at each step match the description's shape table
4. Confirm `np.random.seed(<N>)` with the chosen seed produces well-conditioned matrices (no NaN, no overflow in softmax/sqrt)
5. If any assertion would fail with a correct implementation, fix the test harness before writing the file

Only proceed to Phase 5 once you have mentally verified the full test suite passes.

---

## Phase 5 — Add to challenges.ts

1. Read `apps/study/src/data/challenges.ts` to find the exact closing `]` of the array
2. Construct the complete TypeScript challenge object with all required fields matching the `Challenge` interface:
   ```typescript
   {
     id: string            // kebab-case, unique, matches the function name
     title: string         // Title Case, human-readable
     module: string        // the value decided in Phase 1b — existing or new, research-backed
     difficulty: 'beginner' | 'intermediate' | 'advanced'
     language: 'python'
     tags: string[]        // 3–6 lowercase tags
     visualization: <Name>Visualization,  // only if Phase 3b produced a component; omit otherwise
     description: string   // template literal, plain text
     starterCode: string   // template literal, complete Python file
     staticHint: string    // template literal
   }
   ```
3. Use the Edit tool to insert the new challenge object before the final `]` of the array
4. Verify the file still has valid TypeScript structure (balanced backticks, no trailing commas on last array element before `]`)

---

## Quality bar

Before finishing, check every item:

- [ ] Research phase found the actual formula from the source paper or canonical implementation
- [ ] Module placement decision is documented with evidence from ≥ 2 independent sources (or existing module match is clearly justified)
- [ ] If a new module was created, its name appears in at least one paper title, survey heading, or major codebase directory
- [ ] If a new module was created, at least 2 other plausible future challenges for that module were identified
- [ ] Description has: hook, formula, shape table, numbered steps, requirements, and either an ASCII diagram (if text-only) or a clear graphical callout (if visualization-enabled)
- [ ] Starter code compiles as valid Python (no syntax errors, no undefined names in the harness)
- [ ] Test harness has ≥ 4 assertions with descriptive messages
- [ ] `_ref` in the harness is a correct ground-truth implementation
- [ ] `staticHint` is Socratic — does not give away the full solution
- [ ] New challenge appended cleanly to `challenges.ts`, TypeScript remains valid
- [ ] `id` is unique (not already in the file)
- [ ] If a visualization was created: component compiles without TS errors, import added to `challenges.ts`, `visualization` field present in challenge object, and any complex data flow is fully animated and graphical (no plain-text/ASCII diagrams used in the visualizer)
