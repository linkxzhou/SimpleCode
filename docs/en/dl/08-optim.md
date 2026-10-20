---
language: dl
chapter: 8
title: "Optimizers"
level: intermediate
minutes: 8
goals:
  - "Walk a scalar to 0 in one SGD step"
  - "Watch the first Adam step"
  - "Call zero_grad before backward"
sources:
  - numpy-manual
updated: "2026-10-20"
---

An optimizer only edits data from the gradient. SGD subtracts the learning rate times the gradient. Adam also keeps a first and second moment, so the first step is often steadier.

### One SGD step

w starts at 2. The loss is w squared, so the gradient is 4. With learning rate 0.5, 2 - 0.5*4 lands on 0.

```numpy run expect="0.0" title="One SGD step"
from minitorch import tensor, optim
# Square loss
w = tensor([2.0], requires_grad=True)
opt = optim.SGD([w], lr=0.5)
loss = (w * w).sum()
loss.backward()
opt.step()
print(round(float(w.data[0]), 4))
```

The parameter becomes 0.0.

### Adam's first step

Starting again at 2, Adam uses learning rate 0.1. After bias correction the first step moves about one learning rate along the sign, landing on 1.9.

```numpy run expect="1.9" title="One Adam step"
from minitorch import tensor, optim
# Same square
w = tensor([2.0], requires_grad=True)
opt = optim.Adam([w], lr=0.1)
loss = (w * w).sum()
loss.backward()
opt.step()
print(round(float(w.data[0]), 4))
```

The print is 1.9.

### Clear the gradient first

backward adds the new gradient onto any old grad. Call zero_grad at the start of each batch, or the step keeps growing. Both SGD and Adam offer that method, and so does Module.
