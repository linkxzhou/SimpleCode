---
language: dl
chapter: 5
title: "螺旋分类"
level: intermediate
minutes: 8
goals:
  - "用角度生成三类螺旋点"
  - "用多层网络把训练点分开"
  - "读出准确率"
sources:
  - numpy-manual
updated: "2026-10-20"
---

三类点沿着不同的角度旋开，一条直线分不开。两层网络加上 Adam，在这一小撮点上可以把训练准确率推到 1。

### 先数清点

每条臂 40 个点，三条臂一共 120 个，标签是 0、1、2。半径从 0.05 长到 1，角度错开三分之一个圆。

```numpy run expect="120 3" title="点数"
import numpy as np
# 三条臂
def arm(n, label):
    theta = np.linspace(0, 3.4, n) + label * (2 * np.pi / 3)
    radius = np.linspace(0.05, 1.0, n)
    pts = np.stack([radius * np.cos(theta), radius * np.sin(theta)], axis=1)
    return pts, np.full(n, label)
xa, ya = arm(40, 0)
xb, yb = arm(40, 1)
xc, yc = arm(40, 2)
X = np.concatenate([xa, xb, xc])
Y = np.concatenate([ya, yb, yc])
print(X.shape[0], len(set(Y.tolist())))
```

打印 120 和 3。

### 把训练点分开

隐藏层宽 24，初值由下标的线性同余写死。Adam 学习率 0.08，全批量更新 150 次。准确率不低于 0.8 时额外打印 ok。

```numpy run expect="ok" title="螺旋"
import numpy as np
from minitorch import nn, optim, tensor, cross_entropy
# 固定初值
def arm(n, label):
    theta = np.linspace(0, 3.4, n) + label * (2 * np.pi / 3)
    radius = np.linspace(0.05, 1.0, n)
    pts = np.stack([radius * np.cos(theta), radius * np.sin(theta)], axis=1)
    return pts, np.full(n, label)
xa, ya = arm(40, 0)
xb, yb = arm(40, 1)
xc, yc = arm(40, 2)
X = np.concatenate([xa, xb, xc])
Y = np.concatenate([ya, yb, yc])
net = nn.Sequential(nn.Linear(2, 24), nn.ReLU(), nn.Linear(24, 3))
for param in net.parameters():
    flat = param.data.reshape(-1)
    for i in range(flat.size):
        flat[i] = ((i * 17) % 100) / 100.0 - 0.5
opt = optim.Adam(net.parameters(), lr=0.08)
xt = tensor(X)
for _ in range(150):
    opt.zero_grad()
    loss = cross_entropy(net(xt), Y)
    loss.backward()
    opt.step()
pred = net(xt).data.argmax(axis=1)
acc = float((pred == Y).mean())
print("acc", round(acc, 3))
print("ok" if acc >= 0.8 else "low")
```

最后一行是 ok。

### 这只是训练点

准确率是在同一批点上算的，没有留出测试集。换一批角度或加噪声，数字会掉下来。下一章才把交叉熵的公式摊开。
