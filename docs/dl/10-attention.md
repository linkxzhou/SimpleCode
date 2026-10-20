---
language: dl
chapter: 10
title: "注意力一眼"
level: advanced
minutes: 8
goals:
  - "算缩放点积的加权和"
  - "看均匀分数变成相等权重"
  - "记住缩放因子是键长度的平方根"
sources:
  - numpy-manual
updated: "2026-10-20"
---

注意力用查询和键的点积决定每个值占多少权重。除以键长度的平方根，是为了让点积不要随着维度变长而过大。

### 缩放点积

查询更接近第一把键，所以第一枚值 5 的权重大于第二枚值 9。加权和大约是 6.321，落在 5 和 9 之间，并偏向 5。

```numpy run expect="6.321" title="加权和"
import numpy as np
# 两把键
q = np.array([[1.0, 0.0]])
k = np.array([[1.0, 0.0], [0.0, 1.0]])
v = np.array([[5.0], [9.0]])
scores = (q @ k.T) / np.sqrt(k.shape[1])
weights = np.exp(scores - scores.max())
weights = weights / weights.sum()
out = weights @ v
print(round(float(out[0, 0]), 3))
```

三位小数是 6.321。

### 相同分数得到相同权重

三个一样的分数，softmax 之后每项都是三分之一。round 到四位是 0.3333。谁也没有被特别放大。

```numpy run expect="0.3333" title="均匀权重"
import numpy as np
# 三项相同
scores = np.array([1.0, 1.0, 1.0])
weights = np.exp(scores) / np.exp(scores).sum()
print(round(float(weights[0]), 4))
```

打印 0.3333。

### 这里没有多头

完整的注意力还会把通道拆成多头、加上位置编码，并叠很多层。这一眼只保留查询、键、值和一次 softmax。缩放用的是键向量的长度，例子里是 2 的平方根。
