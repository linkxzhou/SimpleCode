---
language: numpy
chapter: 9
title: "形状"
level: beginner
minutes: 8
goals:
  - "把 12 个数排成 3 行 4 列"
  - "转置后交换行列"
  - "用 -1 让某维自动推断"
sources:
  - numpy-manual
updated: "2026-10-20"
---

shape 是每个轴的长度。reshape 只改看法，元素个数必须对得上。-1 表示这一维按总数自动推算。

### 排成矩阵

12 个连续整数可以看成 3 行 4 列。元素个数 3 乘 4 正好等于 12，否则 reshape 会抛出错误。

```numpy run expect="(3, 4)" title="三行四列"
import numpy as np
# 总数不变
flat = np.arange(12)
print(flat.reshape(3, 4).shape)
```

打印形状元组。

### 转置交换轴

2 行 3 列转置后变成 3 行 2 列。T 是 transpose 的简写，最后两轴对调。

```numpy run expect="3 2" title="转置"
import numpy as np
# 行列对调
a = np.arange(6).reshape(2, 3)
print(a.T.shape[0], a.T.shape[1])
```

两个数是新的行数和列数。

### 自动推断某一维

reshape(3, -1) 在总共 6 个元素时得到 3 行 2 列。两个 -1 无法同时推断，会报错。先算清有几维要固定。
