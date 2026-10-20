---
language: dl
chapter: 11
title: "Dropout and scaling"
level: intermediate
minutes: 9
goals:
  - "Drop the middle value with a fixed mask"
  - "Scale again with a different mask"
  - "Use an all-ones mask when training is off"
sources:
  - micrograd
  - d2l-zh
updated: "2026-10-20"
---

Dropout multiplies activations by a mask of zeros and ones. Kept values are scaled by 1 divided by the keep ratio so the expected magnitude stays put. These masks are fixed, so every run prints the same number. A random mask is a poor expected output.

### Drop the middle 4

The mask is 1, 0, 1, the keep ratio is 2/3, and the scale is 1.5. 2 and 6 times 1.5 add up to 12.0.

```numpy run expect="12.0" title="Scaled total is 12"
from minitorch import tensor
x = tensor([2.0, 4.0, 6.0])
mask = tensor([1.0, 0.0, 1.0])
y = x * mask * (3.0 / 2.0)
print(round(float(y.data.sum()), 1))
```

### Drop the first value

This mask keeps 4 and 6. The same scale of 1.5 makes the sum 15.0. NumPy only does the arithmetic here and builds no graph.

```numpy run expect="15.0" title="The sum is 15"
import numpy as np
x = np.array([2.0, 4.0, 6.0])
mask = np.array([0.0, 1.0, 1.0])
y = x * mask * (3.0 / 2.0)
print(round(float(y.sum()), 1))
```

### No scaling when dropout is off

Three 1 values times an all-ones mask still sum to 3.0. Inference usually uses this mask and does not multiply by 1.5.

```numpy run expect="3.0" title="Stay at 3"
from minitorch import tensor
x = tensor([1.0, 1.0, 1.0])
mask = tensor([1.0, 1.0, 1.0])
y = x * mask
print(round(float(y.data.sum()), 1))
```

### Keep only 5

The exercise mask is 1, 0. The first component 5 stays, and the print is 5.0. Scaling is skipped on purpose so the mask itself is visible.

```numpy run expect="5.0" title="5 remains"
from minitorch import tensor
x = tensor([5.0, 1.0])
keep = tensor([1.0, 0.0])
y = x * keep
print(round(float(y.data[0]), 1))
```

micrograd and nn-zero-to-hero are MIT, and the Dive into Deep Learning code is Apache-2.0. These examples are rewritten for minitorch and do not quote those texts. The Deep Learning book is further reading only: https://book.douban.com/subject/27087503 .
