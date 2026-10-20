---
language: numpy
chapter: 1
title: "创建数组"
level: beginner
minutes: 8
goals:
  - "用 zeros 分配整型网格"
  - "在指定位置写入"
  - "用 arange 生成等差序列"
sources:
  - numpy-manual
updated: "2026-10-20"
---

空数组要先说清形状和元素类型。zeros 把格子填成 0，arange 则按步长吐出一串整数。

### 整型零网格

形状写成二元组。dtype 选 int64 时，后面的赋值不会把格子偷偷变成浮点。

```numpy run expect="7 6" title="写入一格"
import numpy as np
# 第 0 行第 1 列
grid = np.zeros((2, 3), dtype=np.int64)
grid[0, 1] = 7
print(int(grid[0, 1]), grid.size)
```

size 是全部格子的个数，这里是 6。

### 从 0 数到 3

arange 的终点是开区间。tolist 把 ndarray 变回 Python 列表，方便和期望字符串对照。

```numpy run expect="[0, 1, 2, 3]" title="等差四项"
import numpy as np
# 不含终点
print(np.arange(4).tolist())
```

打印结果带着方括号。

### 不要用普通列表硬算

列表的加号是拼接，数组的加号是逐项相加。一旦进入 ndarray，就继续用 NumPy 的函数，不要中途转回循环去改每个元素。
