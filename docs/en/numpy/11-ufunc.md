---
language: numpy
chapter: 11
title: "NumPy ufuncs"
level: intermediate
minutes: 8
goals:
  - "Add 1 to every element with add and sum"
  - "Raise values below 2 with maximum"
  - "Round the mean to one decimal"
sources:
  - numpy-100
updated: "2026-10-20"
---

A ufunc computes element by element and broadcasts when the shapes allow it. It returns a new array and leaves the caller's original alone unless you store back into the same name. These examples reduce the result to one number before printing.

### Add 1 to each element

1, 2, and 3 each gain 1 and become 2, 3, and 4. sum is 9. On this integer array np.add matches a + 1.

```numpy run expect="9" title="Sum after adding one"
import numpy as np
a = np.array([1, 2, 3])
print(int(np.add(a, 1).sum()))
```

### Values below 2 are raised

maximum compares the array with 2 element by element. 1 becomes 2, while 2 and 3 stay. The total is 7.

```numpy run expect="7" title="Raise to 2"
import numpy as np
a = np.array([1, 2, 3])
print(int(np.maximum(a, 2).sum()))
```

### The mean is 2.0

The average of the three floats is 2. Rounding to one decimal prints 2.0 so a binary fraction does not clutter the terminal.

```numpy run expect="2.0" title="One decimal"
import numpy as np
a = np.array([1.0, 2.0, 3.0])
print(round(float(np.mean(a)), 1))
```

### Sum of squares

multiply squares 1, 4, and 2 into 1, 16, and 4. Adding them yields 21.

```numpy run expect="21" title="Square then add"
import numpy as np
a = np.array([1, 4, 2])
print(int(np.multiply(a, a).sum()))
```

numpy-100 is MIT. These arrays and prints are written separately and do not copy its prompts: https://github.com/rougier/numpy-100 . The Python Data Science Handbook is further reading only: https://book.douban.com/subject/27667378 .
