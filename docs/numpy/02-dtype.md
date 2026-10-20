---
language: numpy
chapter: 2
title: "元素类型"
level: beginner
minutes: 8
goals:
  - "认出 float64"
  - "用 mean 得到浮点"
  - "看 uint8 怎样回绕"
sources:
  - numpy-manual
updated: "2026-10-20"
---

每个数组只有一种元素类型。类型决定占多少字节，也决定溢出时是报错还是悄悄回绕。

### 浮点均值

三个整数放进 float64 之后，mean 的结果带小数。打印 dtype 能确认没有被收成整数数组。

```numpy run expect="float64 2.0" title="均值"
import numpy as np
# 显式浮点
x = np.array([1, 2, 3], dtype=np.float64)
print(x.dtype, float(x.mean()))
```

平均值正好是 2.0。

### 八位无符号会回绕

uint8 只保留低 8 位。300 写进去会变成 44，因为 300 减 256 等于 44。这不是四舍五入。

```numpy run expect="44" title="溢出"
import numpy as np
# 300 进 uint8
bits = np.array([300], dtype=np.uint8)
print(int(bits[0]))
```

终端只看到 44。

### astype 会截断小数

从 float64 转到 int64 时，小数部分直接丢掉，不会先 round。1.9 变成 1，2.2 变成 2。需要四舍五入时先调用 round。
