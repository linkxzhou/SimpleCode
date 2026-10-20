---
language: dl
chapter: 13
title: "小循环网络"
level: advanced
minutes: 9
goals:
  - "用 tanh 走两步得到 0.363"
  - "只走第一步看 0.762"
  - "用张量写出激活前的线性部分"
sources:
  - d2l-zh
  - nn-zero-to-hero
updated: "2026-10-20"
---

循环单元把上一时刻的状态乘上系数，再加上当前输入，再过 tanh。minitorch 没有 tanh，所以非线性用 NumPy，线性组合用张量写出来。权重是常数，不在这里训练。

### 两步之后是 0.363

第一步输入 1，状态变成 tanh(1)。第二步输入 0，只剩一半的旧状态。四舍五入到三位是 0.363。

```numpy run expect="0.363" title="两步循环"
import numpy as np
h = 0.0
for x in (1.0, 0.0):
    h = np.tanh(0.5 * h + x)
print(round(float(h), 3))
```

### 第一步是 0.762

只有输入 1 时，tanh(1) 约是 0.762。拿它和两步的结果对照，能看出第二步把状态拉小了。

```numpy run expect="0.762" title="单步"
import numpy as np
h = 0.0
for x in (1.0,):
    h = np.tanh(0.5 * h + x)
print(round(float(h), 3))
```

### 激活前是 1.0

状态从 0 开始，输入是 1，系数是 1。线性部分 h*0.5 + x*1 等于 1.0。tanh 留在别的例子里。

```numpy run expect="1.0" title="线性部分"
from minitorch import tensor
h = tensor([0.0])
x = tensor([1.0])
wh = tensor([0.5])
wx = tensor([1.0])
pre = h * wh + x * wx
print(round(float(pre.data[0]), 1))
```

### 先 0 再 1

顺序换成 0、1。第一步状态仍是 0，第二步就是 tanh(1)，打印 0.762。顺序和数值都对得上。

```numpy run expect="0.762" title="换顺序"
import numpy as np
h = 0.0
for x in (0.0, 1.0):
    h = np.tanh(0.5 * h + x)
print(round(float(h), 3))
```
