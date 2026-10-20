---
language: numpy
chapter: 3
title: "Indexing"
level: beginner
minutes: 8
goals:
  - "Read both ends with positive and negative indexes"
  - "Read a 2-D cell"
  - "Filter with a boolean mask"
sources:
  - numpy-manual
updated: "2026-10-20"
---

Indexes start at 0, and a negative index counts back from the end. A 2-D array takes a row and a column. A boolean array selects the cells that passed a test.

### Both ends

row[0] is the first item and row[-1] is the last. A negative index is shorter than subtracting one from the length.

```numpy run expect="10 40" title="Ends"
import numpy as np
# Four marks
row = np.array([10, 20, 30, 40])
print(int(row[0]), int(row[-1]))
```

The line is 10 and 40.

### A boolean mask

A comparison returns True and False in the same shape. Using that mask as an index keeps only the true cells, in their original order.

```numpy run expect="[8, 9]" title="Greater than 4"
import numpy as np
# Drop the small values
vals = np.array([3, 8, 1, 9])
mask = vals > 4
print(vals[mask].tolist())
```

3 and 1 are dropped.

### Row and column together

table[1, 2] is row 1 and column 2. Two separate brackets also work, but only because the first bracket returns a row. On arange(6).reshape(2, 3) that cell is 5.
