---
language: numpy
chapter: 10
title: "Copies and views"
level: intermediate
minutes: 8
goals:
  - "Separate buffers with copy"
  - "See a slice stay tied to the source"
  - "Notice that asarray does not copy"
sources:
  - numpy-manual
updated: "2026-10-20"
---

Some operations return a view and some return a copy. A view saves memory and also lets a later write touch an array you thought was separate.

### copy is a real split

After dst = src.copy(), changing dst[0] leaves src alone. Use that when the original must survive.

```numpy run expect="1 8" title="Independent copy"
import numpy as np
# Change only the copy
src = np.array([1, 2, 3])
dst = src.copy()
dst[0] = 8
print(int(src[0]), int(dst[0]))
```

The left value stays 1 and the right value is 8.

### A slice stays attached

src[::2] picks indexes 0 and 2 and is still a view. Writing the first item of that view changes the start of the source.

```numpy run expect="[7, 2, 3, 4]" title="Strided view"
import numpy as np
# Write an even index
src = np.array([1, 2, 3, 4])
view = src[::2]
view[0] = 7
print(src.tolist())
```

The first item becomes 7 and the third stays 3.

### asarray keeps an existing array

np.asarray returns the same memory when the input is already an ndarray. Force a duplicate with copy or with np.array(..., copy=True). np.array on a Python list does allocate a fresh buffer.
