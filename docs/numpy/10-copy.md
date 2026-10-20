---
language: numpy
chapter: 10
title: "副本与视图"
level: intermediate
minutes: 8
goals:
  - "用 copy 隔开两份数据"
  - "看切片怎样连着原数组"
  - "分清 asarray 不会复制"
sources:
  - numpy-manual
updated: "2026-10-20"
---

有的操作返回视图，有的返回副本。视图省内存，也会让后面的写入影响到你以为已经分开的数组。

### copy 才真正分开

dst = src.copy() 之后，改 dst[0] 不会动 src。这是需要保留原件时该用的写法。

```numpy run expect="1 8" title="独立副本"
import numpy as np
# 只改副本
src = np.array([1, 2, 3])
dst = src.copy()
dst[0] = 8
print(int(src[0]), int(dst[0]))
```

左边仍是 1，右边是 8。

### 切片仍然连着

src[::2] 取出下标 0 和 2，仍是视图。改视图的第一项，原数组开头就变了。

```numpy run expect="[7, 2, 3, 4]" title="步长视图"
import numpy as np
# 写回偶数位
src = np.array([1, 2, 3, 4])
view = src[::2]
view[0] = 7
print(src.tolist())
```

第一项变成 7，第三项还是 3。

### asarray 看到数组就不动

np.asarray 若传入的已经是 ndarray，返回的就是同一块内存。要强制复制用 np.array(..., copy=True) 或 copy。np.array 对列表才会分配新缓冲。
