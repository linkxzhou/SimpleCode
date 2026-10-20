---
language: dl
chapter: 2
title: "梯度下降"
level: beginner
minutes: 8
goals:
  - "沿导数把标量推到最低点"
  - "看损失怎样落到 0"
  - "记住步长会改变落点速度"
sources:
  - numpy-manual
updated: "2026-10-20"
---

梯度下降反复做同一件事：算出损失对参数的导数，再让参数减去学习率乘导数。一维抛物线最容易看清方向。

### 五步走到谷底

损失是 (w-1) 的平方，导数是 2(w-1)。学习率 0.5 时，每一步正好把剩余距离减半，五步后 w 落到 1，损失打印成 0。

```numpy run expect="w 1.0" title="减半步长"
w = 5.0
# 从 5 出发
loss = 0.0
for _ in range(5):
    loss = (w - 1.0) ** 2
    w = w - 0.5 * 2 * (w - 1.0)
print("loss", round(loss, 4))
print("w", round(w, 4))
```

第二行是 w 1.0。

### 更小的步长慢慢靠近

学习率改成 0.2，更新 20 次，w 从 4 靠近 1，但还差一点点。round 到四位是 1.0001。步长小更稳，也更慢。

```numpy run expect="1.0001" title="小步"
import numpy as np
# 二十次更新
w = np.array([4.0])
for _ in range(20):
    grad = 2 * (w - 1.0)
    w = w - 0.2 * grad
print(round(float(w[0]), 4))
```

还没有严格等于 1。

### 导数指向升高的方向

参数要减去梯度，不是加上。加梯度会把抛物线越推越高。多维时每个参数用自己的偏导，学习率仍然是同一个标量。
