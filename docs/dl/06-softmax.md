---
language: dl
chapter: 6
title: "Softmax 与交叉熵"
level: intermediate
minutes: 8
goals:
  - "让 softmax 的各项加总为 1"
  - "计算一个交叉熵数值"
  - "看正确类的梯度是负的"
sources:
  - numpy-manual
updated: "2026-10-20"
---

多分类不要直接用均方误差去拟合类别编号。softmax 把 logits 收成概率，交叉熵惩罚正确类上的概率不够大。

### 概率加总为 1

softmax 先减去最大值，再做指数和归一化。无论 logits 怎么平移，三项之和都是 1。

```numpy run expect="1.0" title="归一化"
import numpy as np
from minitorch import softmax
# 三项概率
logits = np.array([[2.0, 1.0, 0.1]])
print(round(float(softmax(logits).sum()), 4))
```

打印 1.0。

### 正确类的负对数

标签 0 表示第一类。cross_entropy 返回这一项概率的负对数，再对样本取平均。这里只有一行，数值大约 0.2395。

```numpy run expect="0.2395" title="交叉熵"
from minitorch import tensor, cross_entropy
# 标签 0
logits = tensor([[2.0, 0.0, 0.0]], requires_grad=True)
loss = cross_entropy(logits, [0])
print(round(loss.item(), 4))
```

四位小数是 0.2395。

### 梯度把正确类往上推

对 logits 回传时，正确类的梯度是概率减 1，所以是负数；其余类的梯度是正的概率。参数更新时减去这个梯度，正确类的 logit 会变大。
