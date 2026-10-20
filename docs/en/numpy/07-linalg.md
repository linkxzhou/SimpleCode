---
language: numpy
chapter: 7
title: "Linear algebra"
level: intermediate
minutes: 8
goals:
  - "Take the determinant of a diagonal matrix"
  - "Multiply matrices with @"
  - "Read the trace of an identity"
sources:
  - numpy-manual
updated: "2026-10-20"
---

np.linalg holds determinants, inverses, and least squares. Everyday products use @. You do not need the older matrix type.

### Determinant of a diagonal matrix

Diagonal entries 2 and 3 make a determinant of 6, their product. The off-diagonal zeros add no cross term.

```numpy run expect="6.0" title="Determinant"
import numpy as np
# Diagonal matrix
a = np.array([[2.0, 0.0], [0.0, 3.0]])
print(float(np.linalg.det(a)))
```

The value is 6.0.

### A matrix times a vector

@ follows linear-algebra rules, not elementwise multiplication. A 2 by 2 matrix times a 2 by 1 column returns that first column: 1 and 3.

```numpy run expect="[1.0, 3.0]" title="Matrix product"
import numpy as np
# First column
a = np.array([[1.0, 2.0], [3.0, 4.0]])
b = np.array([[1.0], [0.0]])
print((a @ b).reshape(-1).tolist())
```

reshape flattens the column before printing.

### Trace sums the diagonal

np.eye(3) has three ones on the diagonal, so the trace is 3. The matrix has to be square. Otherwise trace is undefined and the call raises.
