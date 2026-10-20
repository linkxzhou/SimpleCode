---
language: numpy
chapter: 15
title: "NumPy 结构化数组"
level: advanced
minutes: 9
goals:
  - "用字段名取出数量并求和"
  - "按数量筛选货号"
  - "改掉一行之后再求和"
sources:
  - numpy-100
updated: "2026-10-20"
---

结构化数组的每个元素是一条记录，字段用 dtype 里的名字访问。这里的货号是 Unicode 长度 4 的字符串，数量是 32 位整数。字段切片仍然连着原记录，改字段会改原数组。

### 数量合计是 5

tea 的数量是 4，cup 是 1。rows["qty"] 得到整数数组，sum 是 5。

```numpy run expect="5" title="字段求和"
import numpy as np
dt = np.dtype([("sku", "U4"), ("qty", "i4")])
rows = np.array([("tea", 4), ("cup", 1)], dtype=dt)
print(int(rows["qty"].sum()))
```

### 数量大于 2 的货号

布尔条件留在记录上，再取 sku。只有 tea 符合，打印 tea。

```numpy run expect="tea" title="筛出 tea"
import numpy as np
dt = np.dtype([("sku", "U4"), ("qty", "i4")])
rows = np.array([("tea", 4), ("cup", 1)], dtype=dt)
print(rows[rows["qty"] > 2]["sku"][0])
```

### 把 cup 改成 6

第二行的数量从 1 改成 6。4 加 6 得到 10。

```numpy run expect="10" title="改后合计"
import numpy as np
dt = np.dtype([("sku", "U4"), ("qty", "i4")])
rows = np.array([("tea", 4), ("cup", 1)], dtype=dt)
rows["qty"][1] = 6
print(int(rows["qty"].sum()))
```

### 至少 3 的有两行

tea 是 4，mug 是 3，cup 是 1。条件 qty >= 3 数出 2 行。

```numpy run expect="2" title="两行达标"
import numpy as np
dt = np.dtype([("sku", "U4"), ("qty", "i4")])
rows = np.array([("tea", 4), ("cup", 1), ("mug", 3)], dtype=dt)
print(int((rows["qty"] >= 3).sum()))
```
