---
language: dl
chapter: 4
title: "XOR and a small MLP"
level: intermediate
minutes: 8
goals:
  - "Train XOR from a handwritten init"
  - "Read 0 and 1 on the four corners"
  - "See ReLU clip a negative"
sources:
  - numpy-manual
updated: "2026-10-20"
---

XOR is not separable by one straight cut. Two linear layers with a ReLU between them map the four corners to 0, 1, 1, 0. The initial weights below are literals, so no random generator is involved.

### Train for a short while

All four points go forward together. The loss is the mean square gap between prediction and label. SGD uses learning rate 0.2 for 80 updates. The loss starts near 0.62, and the printed classes end as 0 1 1 0.

```numpy run expect="pred 0 1 1 0" title="XOR"
import numpy as np
from minitorch import nn, optim, tensor
# Fixed init
net = nn.Sequential(nn.Linear(2, 4), nn.ReLU(), nn.Linear(4, 1))
hidden, relu, out = net.layers
hidden.weight.data[:] = np.array([[1.2, 1.2], [1.2, 1.2], [-1.2, -1.2], [0.5, 0.5]])
hidden.bias.data[:] = np.array([-0.5, -1.5, 1.5, -0.2])
out.weight.data[:] = np.array([[1.0, -1.5, -1.0, 0.2]])
out.bias.data[:] = np.array([0.4])
x = tensor([[0.0, 0.0], [0.0, 1.0], [1.0, 0.0], [1.0, 1.0]])
y = tensor([[0.0], [1.0], [1.0], [0.0]])
opt = optim.SGD(net.parameters(), lr=0.2)
for _ in range(80):
    opt.zero_grad()
    pred = net(x)
    loss = ((pred - y) * (pred - y)).mean()
    loss.backward()
    opt.step()
bits = [int(v > 0.5) for v in net(x).data.reshape(-1)]
print("pred", *bits)
```

One line reads pred 0 1 1 0.

### ReLU drops negatives

ReLU turns negatives into 0 and keeps positives. Without that bend, stacking two linear layers is still one straight map.

```numpy run expect="[0.0, 0.5]" title="ReLU"
from minitorch import tensor
# Clip
x = tensor([-1.5, 0.5])
print(x.relu().data.tolist())
```

The left value is clipped to 0.

### Labels must match the output shape

The output here is 4 by 1, and the labels are 4 by 1 as well. A flat label of four numbers broadcasts the wrong way on subtraction, so the loss is no longer those four errors.
