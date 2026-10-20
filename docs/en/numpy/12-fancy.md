---
language: numpy
chapter: 12
title: "NumPy boolean and fancy indexing"
level: intermediate
minutes: 9
goals:
  - "Sum values greater than 2 with a boolean mask"
  - "Take indexes 0 and 2 with an integer array"
  - "Write 0 into two indexes"
sources:
  - numpy-100
updated: "2026-10-20"
---

Boolean indexing selects elements by a condition, and fancy indexing selects positions with an integer array. Both copy into a new array, unlike a plain slice that shares memory. Assigning through fancy indexes writes those positions in the original.

### Sum of values above 2

The mask is true on 4 and 9. Adding the selected elements yields 13. 1 and 2 are dropped.

```numpy run expect="13" title="Conditional sum"
import numpy as np
a = np.array([1, 4, 2, 9])
print(int(a[a > 2].sum()))
```

### Indexes 0 and 2

The integer array [0, 2] picks 1 and 2. Their sum is 3. Index order is the result order.

```numpy run expect="3" title="Fancy take"
import numpy as np
a = np.array([1, 4, 2, 9])
print(int(a[np.array([0, 2])].sum()))
```

### Write 0 in two places

Indexes 0 and 3 used to be 1 and 9. After they become 0, 4 and 2 remain and the total is 6.

```numpy run expect="6" title="Change two slots"
import numpy as np
a = np.array([1, 4, 2, 9])
a[np.array([0, 3])] = 0
print(int(a.sum()))
```

### Sum of values equal to 5

The array contains two 5 values. The boolean condition a == 5 adds them and prints 10.

```numpy run expect="10" title="Two fives"
import numpy as np
a = np.array([5, 1, 5, 2])
print(int(a[a == 5].sum()))
```
