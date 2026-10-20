---
language: dl
chapter: 15
title: "Learning rate and early stopping"
level: intermediate
minutes: 9
goals:
  - "Stop when the loss gets worse"
  - "Halve the learning rate and take another step"
  - "See the parameter left by a smaller learning rate"
sources:
  - micrograd
  - d2l-zh
updated: "2026-10-20"
---

Early stopping watches a validation loss. The best record updates while the new loss is smaller, and the loop stops at the first step that gets worse. Halving the learning rate sits in the loop, so the next SGD step is shorter. The gradient of a square loss is twice the parameter, so the step can be checked by hand.

### Stop on the third number

The losses are 5, 3, and 4. 3 is better than 5 and 4 is worse than 3, so the loop stops at index 2 and the best loss is 3. The print is 2 3.

```numpy run expect="2 3" title="Early stop"
losses = [5.0, 3.0, 4.0]
best = losses[0]
stop = 0
for i, loss in enumerate(losses):
    if loss < best:
        best = loss
    else:
        if i > 0:
            stop = i
            break
print(stop, int(best))
```

### After two steps the value is 1.5

The parameter starts at 4. The first learning rate is 0.25 and the gradient is 8, so it moves to 2. After the learning rate is halved, the gradient is 4 and subtracting 0.5 lands on 1.5.

```numpy run expect="1.5" title="Halved step"
from minitorch import tensor, optim
w = tensor([4.0], requires_grad=True)
lr = 0.25
for _ in range(2):
    opt = optim.SGD([w], lr=lr)
    loss = (w * w).sum()
    loss.backward()
    opt.step()
    w.grad = None
    lr = lr / 2
print(round(float(w.data[0]), 1))
```

### A small learning rate stops at 3.2

With learning rate 0.1, 4 minus 0.1 times 8 is 3.2. The step is shorter than 0.25 and ends farther from 0.

```numpy run expect="3.2" title="Short step"
from minitorch import tensor, optim
w = tensor([4.0], requires_grad=True)
opt = optim.SGD([w], lr=0.1)
loss = (w * w).sum()
loss.backward()
opt.step()
print(round(float(w.data[0]), 1))
```

### Keep going while it improves

4, 3, and 2 each get smaller. The loop does not break early, so it stops at the last index 2 and the best loss is 2. The print is 2 2.

```numpy run expect="0 4" title="Never got worse"
losses = [4.0, 3.0, 2.0]
best = losses[0]
stop = len(losses) - 1
for i, loss in enumerate(losses):
    if loss < best:
        best = loss
    else:
        stop = i
        break
print(stop, int(best))
```
