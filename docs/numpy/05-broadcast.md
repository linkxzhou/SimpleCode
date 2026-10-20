---
language: numpy
chapter: 5
title: "广播"
level: beginner
minutes: 8
goals:
  - "让列向量和行向量相加"
  - "给整组数加一个标量"
  - "记住形状要能对齐"
sources:
  - numpy-manual
updated: "2026-10-20"
---

广播从末尾对齐形状。某一维是 1 时，可以拉成另一边的长度。两边都不为 1 且长度不同，运算会直接失败。

### 列加上行

形状 (3, 1) 和 (2,) 对齐后变成 (3, 2)。每一行都加上同一对 10 和 20，每一列都加上同一个行号偏移。

```numpy run expect="(3, 2)" title="外加"
import numpy as np
# 形状被拉开
col = np.array([[1], [2], [3]])
row = np.array([10, 20])
print((col + row).shape)
```

打印的是元组 (3, 2)。

### 标量作用到每一项

一个数字可以和任意形状相加。这里给 1、2、3 各加 10，得到 11、12、13。

```numpy run expect="[11, 12, 13]" title="加十"
import numpy as np
# 标量广播
a = np.array([1, 2, 3])
print((a + 10).tolist())
```

三项都被抬高。

### 对不齐就停

形状 (2, 3) 不能加到 (2, 4) 上，末尾 3 和 4 都不是 1。报错信息会写出两个形状。先 reshape 或加新轴，再做运算。
