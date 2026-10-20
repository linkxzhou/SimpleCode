---
language: dl
chapter: 9
title: "A short look at convolution"
level: advanced
minutes: 8
goals:
  - "Difference a row with a 1-D kernel"
  - "Apply a hand-written Laplacian"
  - "Pool with a maximum"
sources:
  - numpy-manual
updated: "2026-10-20"
---

Convolution slides a small kernel over an input and takes a dot product at each stop. This chapter only checks three positions with NumPy. It does not train a convolutional layer.

### A 1-D difference

The kernel [1, 0, -1] subtracts the right neighbor from the left one. Sliding it over 1, 2, 3, 4, 5 three times yields -2 every time.

```numpy run expect="[-2.0, -2.0, -2.0]" title="1-D kernel"
import numpy as np
# Three dots
image = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
kernel = np.array([1.0, 0.0, -1.0])
out = np.array([float(np.dot(image[i:i + 3], kernel)) for i in range(3)])
print(out.tolist())
```

All three stops are -2.0.

### Max pooling

Pooling does not multiply by a kernel. It keeps the max inside a small window. The largest of these four cells is 4. That lowers resolution and drops location detail.

```numpy run expect="4.0" title="Max pool"
import numpy as np
# Four cells
x = np.array([[1.0, 2.0], [3.0, 4.0]])
print(float(x.max()))
```

The print is 4.0.

### A 2-D kernel looks at the center

A Laplacian has -4 in the center and 1 on the four adjacent cells. Placed on a 3 by 3 grid of 0 through 8, the center contributes -16 and the neighbors contribute 16, so the sum is 0. A trained convolutional layer needs more machinery. This check only confirms that constant.
