---
language: dl
chapter: 11
title: "丢弃与缩放"
level: intermediate
minutes: 9
goals:
  - "用固定掩码丢掉中间那个数"
  - "换一张掩码再缩放"
  - "训练关闭时掩码全是 1"
sources:
  - micrograd
  - d2l-zh
updated: "2026-10-20"
---

丢弃用 0 和 1 的掩码把一部分激活乘掉。为了让期望幅度不变，保留下来的值要乘上 1 除以保留比例。这里的掩码是写死的，这样每次运行都得到同一个数。随机掩码不适合做期望输出。

### 丢掉中间的 4

掩码是 1、0、1，保留比例是 2/3，缩放是 1.5。2 和 6 乘上 1.5 再相加是 12.0。

```numpy run expect="12.0" title="缩放后是 12"
from minitorch import tensor
x = tensor([2.0, 4.0, 6.0])
mask = tensor([1.0, 0.0, 1.0])
y = x * mask * (3.0 / 2.0)
print(round(float(y.data.sum()), 1))
```

### 丢掉第一个

这张掩码保留 4 和 6。同样乘 1.5，和是 15.0。NumPy 只负责这一次数值，不建计算图。

```numpy run expect="15.0" title="和是 15"
import numpy as np
x = np.array([2.0, 4.0, 6.0])
mask = np.array([0.0, 1.0, 1.0])
y = x * mask * (3.0 / 2.0)
print(round(float(y.sum()), 1))
```

### 关闭时不缩放

三个 1 乘上全 1 掩码，和仍是 3.0。推理阶段通常用这张掩码，不再乘 1.5。

```numpy run expect="3.0" title="保持 3"
from minitorch import tensor
x = tensor([1.0, 1.0, 1.0])
mask = tensor([1.0, 1.0, 1.0])
y = x * mask
print(round(float(y.data.sum()), 1))
```

### 只留下 5

练习的掩码是 1、0。第一个分量 5 留下来，打印 5.0。这里故意不缩放，用来看掩码本身。

```numpy run expect="5.0" title="剩下 5"
from minitorch import tensor
x = tensor([5.0, 1.0])
keep = tensor([1.0, 0.0])
y = x * keep
print(round(float(y.data[0]), 1))
```

micrograd 与 nn-zero-to-hero 是 MIT，动手学深度学习的代码是 Apache-2.0。示例按 minitorch 重写，没有摘录原文。花书只作延伸阅读：https://book.douban.com/subject/27087503 。
