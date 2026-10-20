---
language: numpy
chapter: 13
title: "NumPy sort and search"
level: intermediate
minutes: 8
goals:
  - "Get the smallest number with sort"
  - "Find the index of the minimum with argsort"
  - "Find an insertion point with searchsorted"
sources:
  - numpy-100
updated: "2026-10-20"
---

np.sort returns a sorted copy and does not change the original. argsort returns indexes, and indexing the original with them produces the sorted order. searchsorted assumes the input is already ascending and returns where a new value should be inserted.

### The smallest is 1

After sorting 3, 1, and 2, the first element is 1. The original a is still 3, 1, 2 because sort made a copy.

```numpy run expect="1" title="Sorted copy"
import numpy as np
a = np.array([3, 1, 2])
print(int(np.sort(a)[0]))
```

### Index of the minimum

1 sits at index 1 in the original. The first result of argsort is that index.

```numpy run expect="1" title="Index 1"
import numpy as np
a = np.array([3, 1, 2])
print(int(np.argsort(a)[0]))
```

### 3 belongs after 2

The sorted array is 1, 2, 4. The insertion index of 3 is 2, just before 4.

```numpy run expect="2" title="Insertion index"
import numpy as np
a = np.array([1, 2, 4])
print(int(np.searchsorted(a, 3)))
```

### The largest is 3

The last index from argsort points at the maximum. Indexing the original with it prints 3.

```numpy run expect="3" title="Largest element"
import numpy as np
a = np.array([3, 1, 2])
print(int(a[np.argsort(a)][-1]))
```
