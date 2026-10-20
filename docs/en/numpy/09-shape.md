---
language: numpy
chapter: 9
title: "Shapes"
level: beginner
minutes: 8
goals:
  - "Lay 12 numbers into 3 by 4"
  - "Swap axes with a transpose"
  - "Let -1 infer one dimension"
sources:
  - numpy-manual
updated: "2026-10-20"
---

shape is the length of each axis. reshape only changes the view of the same items, so the counts must match. -1 asks NumPy to infer that one dimension.

### Lay out a matrix

Twelve contiguous integers can be viewed as 3 rows by 4 columns. The product 3 times 4 equals 12. Any other product makes reshape raise.

```numpy run expect="(3, 4)" title="Three by four"
import numpy as np
# Count stays 12
flat = np.arange(12)
print(flat.reshape(3, 4).shape)
```

The print is the shape tuple.

### Transpose swaps axes

A 2 by 3 array becomes 3 by 2 after a transpose. T is shorthand for transpose and swaps the last two axes.

```numpy run expect="3 2" title="Transpose"
import numpy as np
# Axes swap
a = np.arange(6).reshape(2, 3)
print(a.T.shape[0], a.T.shape[1])
```

The two numbers are the new row and column counts.

### Infer one axis

reshape(3, -1) on six items yields 3 by 2. Two -1 entries cannot be inferred together and raise. Fix every axis except one.
