---
language: numpy
chapter: 14
title: "NumPy einsum"
level: advanced
minutes: 9
goals:
  - "Sum a vector with subscript notation"
  - "Take the trace of a square matrix"
  - "Compute a dot product and a matrix-vector product"
sources:
  - numpy-100
updated: "2026-10-20"
---

einsum describes multiply-adds with a subscript string. A repeated index is multiplied and then summed, and an index missing on the right of the arrow is reduced away. The same math can be written with sum or @. The subscript form packs those steps into one call.

### Sum a vector

i-> means the only index is reduced away. The sum of 1, 2, and 3 is 6.

```numpy run expect="6" title="Reduce i"
import numpy as np
a = np.array([1, 2, 3])
print(int(np.einsum("i->", a)))
```

### Add the diagonal

ii-> keeps positions where the two indexes match, which are 1 and 4. The trace is 5.

```numpy run expect="5" title="Trace is 5"
import numpy as np
m = np.array([[1, 2], [3, 4]])
print(int(np.einsum("ii->", m)))
```

### A masked dot product

The second vector is 1, 0, 1, so the middle 2 is multiplied by 0. The remaining 1 and 3 sum to 4.

```numpy run expect="4" title="Dot product 4"
import numpy as np
a = np.array([1, 2, 3])
b = np.array([1, 0, 1])
print(int(np.einsum("i,i->", a, b)))
```

### Matrix times vector

ij,j->i is a matrix times a column vector. The two components of the result are then summed. The print is that sum.

```numpy run expect="10" title="Multiply then add"
import numpy as np
m = np.array([[1, 2], [3, 4]])
v = np.array([1, 1])
print(int(np.einsum("ij,j->i", m, v).sum()))
```
