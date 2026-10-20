---
language: dl
chapter: 14
title: "迷你注意力块"
level: advanced
minutes: 10
goals:
  - "算两枚词元的注意力再过一层 ReLU"
  - "看第一行分到自己的权重"
  - "用张量做一次小前馈"
sources:
  - d2l-zh
  - nn-zero-to-hero
updated: "2026-10-20"
---

这一章把缩放点积和一层 ReLU 前馈接在一起，尺寸只有 2。权重是手写常数，不更新。softmax 用减去最大值的指数，避免更大的分数溢出。它不是完整的 Transformer，没有多头，也没有位置编码训练。

### 隐藏层的和是 3.0

两个正交词元先做缩放点积，再按行归一，得到上下文。乘上对角的 W1 之后 ReLU 不改变这些正数，和是 3.0。

```numpy run expect="3.0" title="前馈求和"
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

### 自己的权重约 0.67

第一行和自己的分数更高，分到的权重四舍五入到两位是 0.67。另一枚词元分到剩下的部分。

```numpy run expect="0.67" title="自权重"
import numpy as np
x = np.array([[1.0, 0.0], [0.0, 1.0]])
scores = x @ x.T / np.sqrt(2.0)
weights = np.exp(scores - scores.max(axis=1, keepdims=True))
weights = weights / weights.sum(axis=1, keepdims=True)
print(round(float(weights[0, 0]), 2))
```

### 张量前馈

上下文写成 0.67 和 0.33，乘上列向量 1 和 2。ReLU 之后是 1.33。这一步用 minitorch 的矩阵乘。

```numpy run expect="1.33" title="矩阵乘"
from minitorch import tensor
ctx = tensor([[0.67, 0.33]])
w1 = tensor([[1.0], [2.0]])
hidden = (ctx @ w1).relu()
print(round(float(hidden.data[0, 0]), 2))
```

### 三个相同分数

分数都是 1 时，权重应当平分。第一项四舍五入到四位是 0.3333。

```numpy run expect="0.3333" title="均匀权重"
import numpy as np
score = np.array([1.0, 1.0, 1.0])
weights = np.exp(score - score.max())
weights = weights / weights.sum()
print(round(float(weights[0]), 4))
```
