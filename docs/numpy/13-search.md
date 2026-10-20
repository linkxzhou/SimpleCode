---
language: numpy
chapter: 13
title: "NumPy 排序与查找"
level: intermediate
minutes: 8
goals:
  - "用 sort 得到最小的数"
  - "用 argsort 找到最小值的下标"
  - "用 searchsorted 找插入位置"
sources:
  - numpy-100
updated: "2026-10-20"
---

np.sort 返回排好的副本，不改原数组。argsort 返回的是下标，原数组按这些下标重排就能得到有序结果。searchsorted 假定输入已经从小到大，它给出新值应该插入的位置。

### 最小的是 1

3、1、2 排序后第一个元素是 1。原数组 a 仍然是 3、1、2，因为 sort 做了副本。

```numpy run expect="1" title="排序副本"
import numpy as np
a = np.array([3, 1, 2])
print(int(np.sort(a)[0]))
```

### 最小值的下标

1 在原数组的下标 1 上。argsort 的第一个结果就是这个下标。

```numpy run expect="1" title="下标 1"
import numpy as np
a = np.array([3, 1, 2])
print(int(np.argsort(a)[0]))
```

### 3 应该插在 2 后面

有序数组是 1、2、4。3 的插入位置是 2，也就是 4 之前。

```numpy run expect="2" title="插入位置"
import numpy as np
a = np.array([1, 2, 4])
print(int(np.searchsorted(a, 3)))
```

### 最大的是 3

argsort 的最后一个下标指向最大值。用它取回原数组，打印 3。

```numpy run expect="3" title="最大元素"
import numpy as np
a = np.array([3, 1, 2])
print(int(a[np.argsort(a)][-1]))
```
