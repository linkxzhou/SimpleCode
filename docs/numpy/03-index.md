---
language: numpy
chapter: 3
title: "下标"
level: beginner
minutes: 8
goals:
  - "用正负下标取两端"
  - "用行列下标读二维"
  - "用布尔掩码筛选"
sources:
  - numpy-manual
updated: "2026-10-20"
---

下标从 0 开始，负数从末尾倒数。二维数组用一行一列两个整数，布尔数组则用来挑出满足条件的元素。

### 两端

row[0] 是第一项，row[-1] 是最后一项。不要用 len 减一再去取末尾，负数下标更短。

```numpy run expect="10 40" title="首尾"
import numpy as np
# 四个刻度
row = np.array([10, 20, 30, 40])
print(int(row[0]), int(row[-1]))
```

打印出 10 和 40。

### 布尔掩码

比较运算得到同样形状的 True 和 False。用它做下标时，只留下条件为真的那些值，顺序保持不变。

```numpy run expect="[8, 9]" title="大于 4"
import numpy as np
# 筛掉小数
vals = np.array([3, 8, 1, 9])
mask = vals > 4
print(vals[mask].tolist())
```

3 和 1 被丢掉。

### 行列一起写

table[1, 2] 是第 1 行第 2 列，不要写成两个连续的方括号，除非你有意先取出整行再取列。arange(6).reshape(2, 3) 的这个位置是 5。
