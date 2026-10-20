---
language: numpy
chapter: 2
title: "dtypes"
level: beginner
minutes: 8
goals:
  - "Recognize float64"
  - "Take a floating mean"
  - "See uint8 wrap"
sources:
  - numpy-manual
updated: "2026-10-20"
---

Every array has a single element type. That type chooses the byte width and decides whether overflow wraps or raises.

### A floating mean

Once three integers live in float64, mean keeps a fractional part. Printing dtype confirms the array was not narrowed back to integers.

```numpy run expect="float64 2.0" title="Mean"
import numpy as np
# Explicit floats
x = np.array([1, 2, 3], dtype=np.float64)
print(x.dtype, float(x.mean()))
```

The average is exactly 2.0.

### uint8 wraps

uint8 keeps only the low 8 bits. Storing 300 yields 44, because 300 minus 256 is 44. That is modular wrap, not rounding.

```numpy run expect="44" title="Overflow"
import numpy as np
# 300 into uint8
bits = np.array([300], dtype=np.uint8)
print(int(bits[0]))
```

The terminal shows 44.

### astype truncates

Casting float64 to int64 drops the fraction. It does not call round first, so 1.9 becomes 1 and 2.2 becomes 2. Call round yourself when you want the nearest integer.
