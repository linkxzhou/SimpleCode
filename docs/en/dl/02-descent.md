---
language: dl
chapter: 2
title: "Gradient descent"
level: beginner
minutes: 8
goals:
  - "Follow a derivative to a scalar minimum"
  - "Watch a loss fall to 0"
  - "See the step size change the speed"
sources:
  - numpy-manual
updated: "2026-10-20"
---

Gradient descent repeats one move: take the derivative of the loss, then subtract the learning rate times that derivative. A one-dimensional parabola shows the direction clearly.

### Five steps to the valley

The loss is (w-1) squared, so the derivative is 2(w-1). With learning rate 0.5 each step halves the remaining distance. After five steps w is 1 and the printed loss is 0.

```numpy run expect="w 1.0" title="Halving steps"
w = 5.0
# Start at 5
loss = 0.0
for _ in range(5):
    loss = (w - 1.0) ** 2
    w = w - 0.5 * 2 * (w - 1.0)
print("loss", round(loss, 4))
print("w", round(w, 4))
```

The second line is w 1.0.

### A smaller step creeps in

Learning rate 0.2 and 20 updates carry w from 4 toward 1, with a little left over. Rounded to four places it is 1.0001. A short step is steadier and slower.

```numpy run expect="1.0001" title="Short step"
import numpy as np
# Twenty updates
w = np.array([4.0])
for _ in range(20):
    grad = 2 * (w - 1.0)
    w = w - 0.2 * grad
print(round(float(w[0]), 4))
```

It is not exactly 1 yet.

### The derivative points uphill

Subtract the gradient from the parameter. Adding it pushes the parabola higher. In several dimensions each parameter uses its own partial derivative, and the learning rate stays one shared scalar.
