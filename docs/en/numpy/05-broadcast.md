---
language: numpy
chapter: 5
title: "Broadcasting"
level: beginner
minutes: 8
goals:
  - "Add a column vector to a row vector"
  - "Add a scalar to a whole array"
  - "See which shapes line up"
sources:
  - numpy-manual
updated: "2026-10-20"
---

Broadcasting aligns shapes from the trailing axis. A size of 1 can stretch to match the other side. If both sides differ and neither is 1, the operation fails.

### A column plus a row

Shapes (3, 1) and (2,) line up as (3, 2). Each row gains the pair 10 and 20, and each column gains the same row offset.

```numpy run expect="(3, 2)" title="Outer add"
import numpy as np
# Shapes stretch
col = np.array([[1], [2], [3]])
row = np.array([10, 20])
print((col + row).shape)
```

The print is the tuple (3, 2).

### A scalar reaches every item

A bare number adds to any shape. Adding 10 to 1, 2, and 3 produces 11, 12, and 13.

```numpy run expect="[11, 12, 13]" title="Plus ten"
import numpy as np
# Scalar broadcast
a = np.array([1, 2, 3])
print((a + 10).tolist())
```

All three items move up.

### A mismatch stops

A shape (2, 3) cannot add to (2, 4), because the trailing 3 and 4 are both larger than 1. The error names both shapes. Reshape or insert an axis before the arithmetic.
