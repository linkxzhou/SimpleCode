---
language: dl
chapter: 14
title: "A mini attention block"
level: advanced
minutes: 10
goals:
  - "Run attention on two tokens and then a ReLU layer"
  - "See how much weight the first row keeps for itself"
  - "Do one small feed-forward step with tensors"
sources:
  - d2l-zh
  - nn-zero-to-hero
updated: "2026-10-20"
---

This chapter joins scaled dot-product attention with one ReLU feed-forward layer, at width 2. The weights are handwritten constants and are not updated. Softmax uses exponentials of scores minus their max so larger scores do not overflow. It is not a full Transformer: there are no heads and no trained positional encoding.

### The hidden sum is 3.0

Two orthogonal tokens take a scaled dot product and are normalized by row, producing a context. After the diagonal W1, ReLU leaves those positive numbers alone and their sum is 3.0.

```numpy run expect="3.0" title="Feed-forward sum"
import numpy as np
x = np.array([[1.0, 0.0], [0.0, 1.0]])
scores = x @ x.T / np.sqrt(2.0)
weights = np.exp(scores - scores.max(axis=1, keepdims=True))
weights = weights / weights.sum(axis=1, keepdims=True)
ctx = weights @ x
w1 = np.array([[1.0, 0.0], [0.0, 2.0]])
hidden = np.maximum(ctx @ w1, 0.0)
print(round(float(hidden.sum()), 1))
```

### The self weight is about 0.67

The first row scores higher against itself. Its weight rounded to two decimals is 0.67. The other token receives the rest.

```numpy run expect="0.67" title="Self weight"
import numpy as np
x = np.array([[1.0, 0.0], [0.0, 1.0]])
scores = x @ x.T / np.sqrt(2.0)
weights = np.exp(scores - scores.max(axis=1, keepdims=True))
weights = weights / weights.sum(axis=1, keepdims=True)
print(round(float(weights[0, 0]), 2))
```

### Tensor feed-forward

The context is written as 0.67 and 0.33 and multiplied by the column 1, 2. After ReLU the value is 1.33. This step uses minitorch matrix multiplication.

```numpy run expect="1.33" title="Matrix product"
from minitorch import tensor
ctx = tensor([[0.67, 0.33]])
w1 = tensor([[1.0], [2.0]])
hidden = (ctx @ w1).relu()
print(round(float(hidden.data[0, 0]), 2))
```

### Three equal scores

When every score is 1, the weights should split evenly. The first entry rounded to four decimals is 0.3333.

```numpy run expect="0.3333" title="Even weights"
import numpy as np
score = np.array([1.0, 1.0, 1.0])
weights = np.exp(score - score.max())
weights = weights / weights.sum()
print(round(float(weights[0]), 4))
```
