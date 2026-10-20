---
language: numpy
chapter: 15
title: "NumPy structured arrays"
level: advanced
minutes: 9
goals:
  - "Sum the quantity field by name"
  - "Filter sku values by quantity"
  - "Sum again after editing one row"
sources:
  - numpy-100
updated: "2026-10-20"
---

Each element of a structured array is a record, and fields are reached by the names in the dtype. The sku here is a Unicode string of length 4, and the quantity is a 32-bit integer. A field slice still refers to the original records, so editing a field edits the array.

### The quantities total 5

tea has quantity 4 and cup has 1. rows["qty"] is an integer array and its sum is 5.

```numpy run expect="5" title="Sum a field"
import numpy as np
dt = np.dtype([("sku", "U4"), ("qty", "i4")])
rows = np.array([("tea", 4), ("cup", 1)], dtype=dt)
print(int(rows["qty"].sum()))
```

### Sku values with quantity above 2

The boolean condition stays on the records, then sku is taken. Only tea matches, so the print is tea.

```numpy run expect="tea" title="Filter tea"
import numpy as np
dt = np.dtype([("sku", "U4"), ("qty", "i4")])
rows = np.array([("tea", 4), ("cup", 1)], dtype=dt)
print(rows[rows["qty"] > 2]["sku"][0])
```

### Change cup to 6

The quantity on the second row changes from 1 to 6. 4 plus 6 is 10.

```numpy run expect="10" title="Total after the edit"
import numpy as np
dt = np.dtype([("sku", "U4"), ("qty", "i4")])
rows = np.array([("tea", 4), ("cup", 1)], dtype=dt)
rows["qty"][1] = 6
print(int(rows["qty"].sum()))
```

### Two rows are at least 3

tea is 4, mug is 3, and cup is 1. The condition qty >= 3 counts 2 rows.

```numpy run expect="2" title="Two rows qualify"
import numpy as np
dt = np.dtype([("sku", "U4"), ("qty", "i4")])
rows = np.array([("tea", 4), ("cup", 1), ("mug", 3)], dtype=dt)
print(int((rows["qty"] >= 3).sum()))
```
