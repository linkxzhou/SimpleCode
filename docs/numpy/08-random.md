---
language: numpy
chapter: 8
title: "随机数"
level: beginner
minutes: 8
goals:
  - "用 default_rng 固定种子"
  - "确认抽到的整数落在区间里"
  - "同一种子得到同一串"
sources:
  - numpy-manual
updated: "2026-10-20"
---

新代码用 np.random.default_rng，不要再用全局 np.random.seed。生成器自己保存状态，种子相同就能复现同一串数。

### 整数落在区间内

integers 的上界是开的。0 到 10 的四次抽取，每一项都该大于等于 0 且小于 10。

```numpy run expect="True" title="区间"
import numpy as np
# 种子 7
rng = np.random.default_rng(7)
draw = rng.integers(0, 10, size=4)
print(bool(draw.min() >= 0 and draw.max() <= 9 and draw.size == 4))
```

条件成立时打印 True。

### 同一种子可复现

两个 default_rng(7) 各自的第一串 random 完全相同。把种子写进示例，别人再跑才会得到一样的数。

```numpy run expect="True" title="复现"
import numpy as np
# 比较两串
a = np.random.default_rng(7).random(5)
b = np.random.default_rng(7).random(5)
print(bool(np.array_equal(a, b)))
```

相等就打印 True。

### 全局种子别混用

np.random.rand 走的是另一套全局状态，和 default_rng 互不影响。教学示例统一用生成器，避免两套种子叠在一起。
