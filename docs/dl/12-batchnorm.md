---
language: dl
chapter: 12
title: "按批归一"
level: intermediate
minutes: 9
goals:
  - "把一列标准化成 -1"
  - "看另一列标准化后的和"
  - "用 gamma 和 beta 做仿射"
sources:
  - d2l-zh
  - micrograd
updated: "2026-10-20"
---

按批归一先减去这一批的均值，再除以标准差。两行的一列如果刚好对称，标准化后就是 -1 和 1。随后的 gamma 和 beta 是可学习的缩放和平移，minitorch 用乘法与加法表示它们。

### 第一列变成 -1

第一列是 1 和 3，均值是 2，离均值都是 1。第一行标准化后是 -1.0。

```numpy run expect="-1.0" title="标准化 -1"
import numpy as np
x = np.array([[1.0, 3.0], [3.0, 7.0]])
mu = x.mean(axis=0)
var = ((x - mu) ** 2).mean(axis=0)
y = (x - mu) / np.sqrt(var + 1e-5)
print(round(float(y[0, 0]), 1))
```

### 第二列和为 0

3 和 7 标准化后也是一对相反数。它们的和四舍五入是 0.0。

```numpy run expect="0.0" title="和是 0"
import numpy as np
x = np.array([[1.0, 3.0], [3.0, 7.0]])
mu = x.mean(axis=0)
var = ((x - mu) ** 2).mean(axis=0)
y = (x - mu) / np.sqrt(var + 1e-5)
print(round(float(y[:, 1].sum()), 1))
```

### 仿射到 -1 和 3

已经标准化的 -1 和 1 乘上 gamma 2，再加上 beta 1。结果是 -1.0 和 3.0。

```numpy run expect="-1.0 3.0" title="缩放再平移"
from minitorch import tensor
z = tensor([-1.0, 1.0])
gamma = tensor([2.0, 2.0])
beta = tensor([1.0, 1.0])
out = z * gamma + beta
print(round(float(out.data[0]), 1), round(float(out.data[1]), 1))
```

### 单个特征的正侧

2 和 4 的均值是 3。4 在均值右边，标准化后打印 1.0。

```numpy run expect="1.0" title="右侧是 1"
import numpy as np
x = np.array([2.0, 4.0])
mu = x.mean()
var = ((x - mu) ** 2).mean()
y = (x - mu) / np.sqrt(var + 1e-5)
print(round(float(y[1]), 1))
```
