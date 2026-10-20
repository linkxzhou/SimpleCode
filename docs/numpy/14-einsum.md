---
language: numpy
chapter: 14
title: "NumPy einsum"
level: advanced
minutes: 9
goals:
  - "用下标记号把向量求和"
  - "取出方阵的迹"
  - "做一次点积和一次矩阵乘向量"
sources:
  - numpy-100
updated: "2026-10-20"
---

einsum 用下标字符串描述乘加。重复的下标表示相乘后求和，箭头右边没写的下标会被消掉。同样的计算可以用 sum 或 @ 写出来，下标记号把几步收成一次调用。

### 向量求和

i-> 表示把唯一的下标消掉。1、2、3 的和是 6。

```numpy run expect="6" title="消掉 i"
import numpy as np
a = np.array([1, 2, 3])
print(int(np.einsum("i->", a)))
```

### 对角线相加

ii-> 只留下两个下标相同的位置，也就是 1 和 4。迹是 5。

```numpy run expect="5" title="迹是 5"
import numpy as np
m = np.array([[1, 2], [3, 4]])
print(int(np.einsum("ii->", m)))
```

### 带掩码的点积

第二个向量是 1、0、1，所以中间的 2 被乘成 0。剩下 1 和 3，和是 4。

```numpy run expect="4" title="点积 4"
import numpy as np
a = np.array([1, 2, 3])
b = np.array([1, 0, 1])
print(int(np.einsum("i,i->", a, b)))
```

### 矩阵乘向量

ij,j->i 是矩阵乘列向量。结果的两个分量再求和。这里打印的是那个和。

```numpy run expect="10" title="乘完再加"
import numpy as np
m = np.array([[1, 2], [3, 4]])
v = np.array([1, 1])
print(int(np.einsum("ij,j->i", m, v).sum()))
```
