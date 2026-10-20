---
language: numpy
chapter: 12
title: "NumPy 布尔与花式索引"
level: intermediate
minutes: 9
goals:
  - "用布尔掩码把大于 2 的数加起来"
  - "用整数数组取出第 0 和第 2 个"
  - "把两个下标写成 0"
sources:
  - numpy-100
updated: "2026-10-20"
---

布尔索引按条件选元素，花式索引用整数数组选位置。两者都会复制出新数组，不像普通切片那样和原数组共享内存。给花式索引赋值时，原数组上对应的位置会被改掉。

### 大于 2 的和

掩码在 4 和 9 上为真。把选中的元素相加得到 13。1 和 2 被丢掉。

```numpy run expect="13" title="条件求和"
import numpy as np
a = np.array([1, 4, 2, 9])
print(int(a[a > 2].sum()))
```

### 第 0 和第 2 个

整数数组 [0, 2] 取出 1 和 2。它们的和是 3。下标顺序就是结果的顺序。

```numpy run expect="3" title="花式取出"
import numpy as np
a = np.array([1, 4, 2, 9])
print(int(a[np.array([0, 2])].sum()))
```

### 两处写成 0

下标 0 和 3 原来是 1 和 9。赋成 0 之后，剩下 4 和 2，总和是 6。

```numpy run expect="6" title="改两个位置"
import numpy as np
a = np.array([1, 4, 2, 9])
a[np.array([0, 3])] = 0
print(int(a.sum()))
```

### 等于 5 的和

数组里有两个 5。布尔条件 a == 5 把它们加起来，打印 10。

```numpy run expect="10" title="两个 5"
import numpy as np
a = np.array([5, 1, 5, 2])
print(int(a[a == 5].sum()))
```
