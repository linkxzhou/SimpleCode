---
language: numpy
chapter: 4
title: "Slicing"
level: beginner
minutes: 8
goals:
  - "Take a strided subsequence"
  - "Pull out one column"
  - "Treat a slice as a view"
sources:
  - numpy-manual
updated: "2026-10-20"
---

A slice is start:stop:step, and stop stays outside the result. The piece usually shares memory with the original, so writing through the view writes the source.

### Step of 2

Start at index 1 and keep every second item until just before 6. The kept values are 1, 3, and 5.

```numpy run expect="[1, 3, 5]" title="Every other item"
import numpy as np
# Exclusive stop
seq = np.arange(8)
print(seq[1:6:2].tolist())
```

7 is not in the list.

### Writing a slice writes the source

base[1:3] is not a copy. Setting the view's first item to 99 also changes index 1 of the source. Call copy when you need an independent buffer.

```numpy run expect="99" title="Write through a view"
import numpy as np
# Shared memory
base = np.arange(4)
view = base[1:3]
view[0] = 99
print(int(base[1]))
```

The print reads the original array.

### A colon keeps a whole column

mat[:, 1] takes column 1 from every row. On arange(9).reshape(3, 3) that column is 1, 4, 7. The row slice mat[0, :] is the three numbers on the first row.
