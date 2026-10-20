---
language: numpy
chapter: 16
title: "NumPy vectorization"
level: intermediate
minutes: 9
goals:
  - "Replace a per-item square with array multiplication"
  - "Turn odd numbers into 0 with where"
  - "Multiply two arrays to get an amount"
sources:
  - numpy-100
updated: "2026-10-20"
---

Vectorization applies one operation to a whole array instead of looping over elements in Python. The result should match the loop. This page does not compare timings, because a browser clock jitters. It only checks that both sides compute the same number.

### The loop matches the square sum

The Python loop adds the squares of 1, 2, and 3 and gets 14. a * a summed is also 14. Both numbers are printed.

```numpy run expect="14 14" title="Both are 14"
import numpy as np
def squares(xs):
    total = 0
    for x in xs:
        total += int(x) * int(x)
    return total
a = np.array([1, 2, 3])
print(squares(a), int((a * a).sum()))
```

### Keep the even values

where keeps the original value when it is even and writes 0 otherwise. 2 plus 4 is 6.

```numpy run expect="6" title="Sum of evens"
import numpy as np
a = np.array([1, 2, 3, 4])
print(int(np.where(a % 2 == 0, a, 0).sum()))
```

### Price times quantity

4*2, 1*5, and 3*1 are 8, 5, and 3. The sum of the vector product is 16.

```numpy run expect="16" title="Amount 16"
import numpy as np
price = np.array([4, 1, 3])
qty = np.array([2, 5, 1])
print(int((price * qty).sum()))
```

### reduce and sum

Three 2 values sum to 6. add.reduce performs that same addition, so the second number is also 6.

```numpy run expect="6 6" title="Both are 6"
import numpy as np
a = np.array([2, 2, 2])
print(int(a.sum()), int(np.add.reduce(a)))
```
