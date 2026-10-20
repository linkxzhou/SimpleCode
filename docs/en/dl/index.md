---
language: dl
chapter: 0
title: "Deep learning"
minutes: 8
goals:
  - "Score with a dot product"
  - "Write a gradient from a scalar loss"
  - "Import the preinstalled minitorch"
sources:
  - numpy-manual
updated: "2026-10-20"
---

This book trains tiny models with NumPy. This sidebar row already includes NumPy and puts the teaching package minitorch on the import path. It is a small classroom stand-in with tensors, linear layers, and two optimizers.

### A linear score

A weight vector dotted with an input is one scalar score. Here 2*3 + (-1)*4 equals 2.

```numpy run expect="2.0" title="Dot score"
import numpy as np
# Two weights
w = np.array([2.0, -1.0])
x = np.array([3.0, 4.0])
print(float(w @ x))
```

The print is 2.0.

### Backward writes the gradient

minitorch.tensor records ops when requires_grad is set. The loss is a sum of squares, so the gradient in y is 2y: 1 and 3 become 2 and 6.

```numpy run expect="[2.0, 6.0]" title="Sum-of-squares gradient"
from minitorch import tensor
# backward needs a scalar
y = tensor([1.0, 3.0], requires_grad=True)
loss = (y * y).sum()
loss.backward()
print([round(float(v), 1) for v in y.grad])
```

The gradient list is 2.0 and 6.0.

### Data stays in the tab

Training finishes inside this browser tab. There is no separate compute server. Fashion-MNIST is the small subset shipped with the runtime. Larger weights and full convolutional nets are outside what these chapters run.
### After chapter 11

Dropout with a fixed mask, batch normalization, a two-step recurrence, attention plus a feed-forward layer of width 2, and early stopping with a halved learning rate follow the attention glance. Masks are fixed. minitorch has no tanh, so that nonlinearity uses NumPy.
