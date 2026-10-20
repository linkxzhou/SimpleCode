---
language: dl
chapter: 0
title: "深度学习入门"
minutes: 8
goals:
  - "用向量点积写出线性打分"
  - "让标量损失把梯度写回"
  - "知道 minitorch 已在路径上"
sources:
  - numpy-manual
updated: "2026-10-20"
---

这一册用 NumPy 把小模型训起来。侧栏这一行已经装好 NumPy，并且把教学库 minitorch 放在导入路径上。它不是 PyTorch，接口只覆盖后面几章用到的张量、线性层和两种优化器。

### 线性打分

权重和输入做点积，得到一个标量分数。这里 2*3 + (-1)*4 等于 2。

```numpy run expect="2.0" title="点积打分"
import numpy as np
# 两维权重
w = np.array([2.0, -1.0])
x = np.array([3.0, 4.0])
print(float(w @ x))
```

打印 2.0。

### 反向传播写入梯度

minitorch.tensor 在 requires_grad 打开时记住运算。损失是平方和，对 y 的梯度是 2y，所以 1 和 3 变成 2 和 6。

```numpy run expect="[2.0, 6.0]" title="平方和梯度"
from minitorch import tensor
# 标量才能 backward
y = tensor([1.0, 3.0], requires_grad=True)
loss = (y * y).sum()
loss.backward()
print([round(float(v), 1) for v in y.grad])
```

梯度列表是 2.0 和 6.0。

### 数据留在本机

训练在这个浏览器标签里完成，没有单独的计算服务器。Fashion-MNIST 只用随运行时下载的一小份子集。更大的权重和卷积网络不在这几章的运行范围内。
