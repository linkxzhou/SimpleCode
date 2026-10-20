---
language: dl
chapter: 1
title: "线性回归"
level: beginner
minutes: 8
goals:
  - "用最小二乘解出斜率和截距"
  - "用梯度步把参数推近"
  - "用学到的式子预测"
sources:
  - numpy-manual
updated: "2026-10-20"
---

直线 y = wx + b 用两个数概括一组点。可以一次用最小二乘解出来，也可以让梯度一小步一小步地走。

### 最小二乘

把 x 和一列 1 拼成设计矩阵，np.linalg.lstsq 给出斜率和截距。点 (1,3)、(2,5)、(3,7) 正好落在 y = 2x + 1 上。

```numpy run expect="2.0 1.0" title="闭式解"
import numpy as np
# 设计矩阵
x = np.array([1.0, 2.0, 3.0])
y = np.array([3.0, 5.0, 7.0])
A = np.stack([x, np.ones_like(x)], axis=1)
coef, _, _, _ = np.linalg.lstsq(A, y, rcond=None)
print(round(float(coef[0]), 4), round(float(coef[1]), 4))
```

两个系数是 2.0 和 1.0。

### 用直线预测

斜率 2、截距 1 作用在 x = 4 上，得分 2*4 + 1 = 9。把偏置当成乘在常数 1 上的权重，点积一次就算完。

```numpy run expect="9.0" title="预测"
import numpy as np
# x 等于 4
print(float(np.array([2.0, 1.0]) @ np.array([4.0, 1.0])))
```

输出 9.0。

### 梯度步是另一条路

从 w = 0、b = 0 出发，对每个点累加误差乘上 x，再按学习率更新。步子够多时会靠近 2 和 1，但不会像最小二乘那样一步到位。学习率太大则会在答案两侧跳动。
