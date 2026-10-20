---
language: dl
chapter: 8
title: "优化器"
level: intermediate
minutes: 8
goals:
  - "用 SGD 把一个数一步走到 0"
  - "看 Adam 的第一步"
  - "记住先 zero_grad 再反传"
sources:
  - numpy-manual
updated: "2026-10-20"
---

优化器只负责按梯度改 data。SGD 是学习率乘梯度。Adam 另外记一阶矩和二阶矩，第一步往往走得比较稳。

### SGD 一步

w 从 2 出发，损失是 w 的平方，梯度是 4。学习率 0.5 时，2 - 0.5*4 正好是 0。

```numpy run expect="0.0" title="一步 SGD"
from minitorch import tensor, optim
# 平方损失
w = tensor([2.0], requires_grad=True)
opt = optim.SGD([w], lr=0.5)
loss = (w * w).sum()
loss.backward()
opt.step()
print(round(float(w.data[0]), 4))
```

参数变成 0.0。

### Adam 的第一步

同样从 2 出发，Adam 学习率 0.1。偏差校正之后，第一步几乎沿符号走一个学习率，数值落到 1.9。

```numpy run expect="1.9" title="一步 Adam"
from minitorch import tensor, optim
# 同样的平方
w = tensor([2.0], requires_grad=True)
opt = optim.Adam([w], lr=0.1)
loss = (w * w).sum()
loss.backward()
opt.step()
print(round(float(w.data[0]), 4))
```

打印 1.9。

### 先清梯度

backward 会把新梯度加到旧的 grad 上。每个批次开始时调用 zero_grad，否则步长会越加越大。SGD 和 Adam 都提供这个方法，Module 上也有。
