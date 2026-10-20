---
language: dl
chapter: 4
title: "异或与多层感知机"
level: intermediate
minutes: 8
goals:
  - "用手写初值训练异或"
  - "读出四个角的 0 和 1"
  - "看到 ReLU 怎样截断负数"
sources:
  - numpy-manual
updated: "2026-10-20"
---

异或不能用一条直线分开。两层线性层夹一个 ReLU，就能把四个角送到 0、1、1、0。下面的初值是写死的，不依赖随机数生成器。

### 训一小会儿

四个点一起前向，损失是预测和标签差的平方均值。SGD 学习率 0.2，更新 80 次。开始时损失大约 0.62，结束时打印的类别是 0 1 1 0。

```numpy run expect="pred 0 1 1 0" title="异或"
import numpy as np
from minitorch import nn, optim, tensor
# 固定初值
net = nn.Sequential(nn.Linear(2, 4), nn.ReLU(), nn.Linear(4, 1))
hidden, relu, out = net.layers
hidden.weight.data[:] = np.array([[1.2, 1.2], [1.2, 1.2], [-1.2, -1.2], [0.5, 0.5]])
hidden.bias.data[:] = np.array([-0.5, -1.5, 1.5, -0.2])
out.weight.data[:] = np.array([[1.0, -1.5, -1.0, 0.2]])
out.bias.data[:] = np.array([0.4])
x = tensor([[0.0, 0.0], [0.0, 1.0], [1.0, 0.0], [1.0, 1.0]])
y = tensor([[0.0], [1.0], [1.0], [0.0]])
opt = optim.SGD(net.parameters(), lr=0.2)
for _ in range(80):
    opt.zero_grad()
    pred = net(x)
    loss = ((pred - y) * (pred - y)).mean()
    loss.backward()
    opt.step()
bits = [int(v > 0.5) for v in net(x).data.reshape(-1)]
print("pred", *bits)
```

一行里能看到 pred 0 1 1 0。

### ReLU 去掉负数

负数经过 ReLU 变成 0，正数原样通过。没有这道弯折，两层线性层叠在一起仍然是一条直线。

```numpy run expect="[0.0, 0.5]" title="ReLU"
from minitorch import tensor
# 截断
x = tensor([-1.5, 0.5])
print(x.relu().data.tolist())
```

左边被截成 0。

### 标签要和输出形状对齐

这一章的输出是 4×1，标签也做成 4×1。如果标签是一维的四个数，相减时广播会把形状拉歪，损失就不再是你想的那四个误差。
