---
language: numpy
chapter: 1
title: "Creating arrays"
level: beginner
minutes: 8
goals:
  - "Allocate an integer grid with zeros"
  - "Write one cell"
  - "Build a range with arange"
sources:
  - numpy-manual
updated: "2026-10-20"
---

An empty array needs a shape and a dtype. zeros fills every cell with 0. arange emits integers along a step.

### An integer grid of zeros

Pass the shape as a pair. With dtype int64, a later assignment does not quietly turn the cells into floats.

```numpy run expect="7 6" title="Write one cell"
import numpy as np
# Row 0, column 1
grid = np.zeros((2, 3), dtype=np.int64)
grid[0, 1] = 7
print(int(grid[0, 1]), grid.size)
```

size counts every cell, which is 6 here.

### Count from 0 to 3

The stop argument of arange is exclusive. tolist turns the ndarray back into a Python list so the printed text is easy to match.

```numpy run expect="[0, 1, 2, 3]" title="Four steps"
import numpy as np
# Stop is excluded
print(np.arange(4).tolist())
```

The line includes the brackets.

### Leave the Python list behind

Plus on a list concatenates. Plus on an array adds element by element. After you have an ndarray, stay with NumPy instead of dropping into a Python loop for every cell.
