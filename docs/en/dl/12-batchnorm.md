---
language: dl
chapter: 12
title: "Batch normalization"
level: intermediate
minutes: 9
goals:
  - "Standardize one column to -1"
  - "Sum the other standardized column"
  - "Apply an affine gamma and beta"
sources:
  - d2l-zh
  - micrograd
updated: "2026-10-20"
---

Batch normalization subtracts the batch mean and divides by the standard deviation. A column of two symmetric rows becomes -1 and 1 after that step. gamma and beta are a learned scale and shift. minitorch expresses them with multiplication and addition.

### The first column becomes -1

The first column is 1 and 3, the mean is 2, and both rows sit 1 away from it. The first row standardizes to -1.0.

```numpy run expect="-1.0" title="Standardize to -1"
import numpy as np
x = np.array([[1.0, 3.0], [3.0, 7.0]])
mu = x.mean(axis=0)
var = ((x - mu) ** 2).mean(axis=0)
y = (x - mu) / np.sqrt(var + 1e-5)
print(round(float(y[0, 0]), 1))
```

### The second column sums to 0

3 and 7 also become a pair of opposite numbers. Their rounded sum is 0.0.

```numpy run expect="0.0" title="Sum is 0"
import numpy as np
x = np.array([[1.0, 3.0], [3.0, 7.0]])
mu = x.mean(axis=0)
var = ((x - mu) ** 2).mean(axis=0)
y = (x - mu) / np.sqrt(var + 1e-5)
print(round(float(y[:, 1].sum()), 1))
```

### Affine map to -1 and 3

The already standardized -1 and 1 are multiplied by gamma 2 and then shifted by beta 1. The results are -1.0 and 3.0.

```numpy run expect="-1.0 3.0" title="Scale then shift"
from minitorch import tensor
z = tensor([-1.0, 1.0])
gamma = tensor([2.0, 2.0])
beta = tensor([1.0, 1.0])
out = z * gamma + beta
print(round(float(out.data[0]), 1), round(float(out.data[1]), 1))
```

### The positive side of one feature

The mean of 2 and 4 is 3. 4 sits to the right of the mean, and the standardized print is 1.0.

```numpy run expect="1.0" title="Right side is 1"
import numpy as np
x = np.array([2.0, 4.0])
mu = x.mean()
var = ((x - mu) ** 2).mean()
y = (x - mu) / np.sqrt(var + 1e-5)
print(round(float(y[1]), 1))
```
