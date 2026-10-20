---
language: numpy
chapter: 6
title: "Vectorization"
level: beginner
minutes: 8
goals:
  - "Replace an item loop with multiplication"
  - "Compute a dot product"
  - "Average along an axis"
sources:
  - numpy-manual
updated: "2026-10-20"
---

Prefer a whole-array operation to a Python for loop. Multiplication hits every element at once. Dot products and axis reductions follow the same idea.

### Sum of squares

x * x squares every item, then sum reduces them. The squares from 0 through 4 add up to 30. A running Python loop is the slower spelling of the same math.

```numpy run expect="30" title="Sum of squares"
import numpy as np
# No loop
x = np.arange(5)
print(int((x * x).sum()))
```

The result is the integer 30.

### Dot product

np.dot multiplies aligned items and adds those products. 1*4 + 2*5 + 3*6 equals 32. The two vectors must share a length.

```numpy run expect="32.0" title="Dot"
import numpy as np
# Three aligned terms
a = np.array([1.0, 2.0, 3.0])
b = np.array([4.0, 5.0, 6.0])
print(float(np.dot(a, b)))
```

The print keeps one decimal place.

### Reduce along an axis

mean(axis=0) averages each column, so the result length equals the column count. axis=1 collapses rows. Omit axis and the mean is one number over every cell.
