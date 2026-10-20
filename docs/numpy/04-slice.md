---
language: numpy
chapter: 4
title: "切片"
level: beginner
minutes: 8
goals:
  - "按步长取子序列"
  - "取出一整列"
  - "知道切片是视图"
sources:
  - numpy-manual
updated: "2026-10-20"
---

切片写成 start:stop:step，stop 同样不包含在内。切出来的一块通常和原数组共享内存，改视图会改到原件。

### 步长为 2

从下标 1 开始，每隔一项取一次，直到 6 之前。1、3、5 会被留下。

```numpy run expect="[1, 3, 5]" title="隔项"
import numpy as np
# 开区间终点
seq = np.arange(8)
print(seq[1:6:2].tolist())
```

列表里没有 7。

### 改切片会改原数组

base[1:3] 不是拷贝。把视图的第 0 项改成 99，原数组下标 1 也变成 99。需要独立副本时用 copy。

```numpy run expect="99" title="视图写回"
import numpy as np
# 共享内存
base = np.arange(4)
view = base[1:3]
view[0] = 99
print(int(base[1]))
```

打印的是原数组上的值。

### 冒号表示整列

mat[:, 1] 取出每一行的第 1 列。arange(9).reshape(3, 3) 的这一列是 1、4、7。行切片 mat[0, :] 则是第一行的三个数。
