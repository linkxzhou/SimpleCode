---
language: dl
chapter: 5
title: "A spiral classifier"
level: intermediate
minutes: 8
goals:
  - "Place three spiral arms from angles"
  - "Separate the training points with a small net"
  - "Read the accuracy"
sources:
  - numpy-manual
updated: "2026-10-20"
---

Three arms of points rotate apart, so one straight cut fails. A two-layer net with Adam can push training accuracy to 1 on this small cloud.

### Count the points first

Each arm has 40 points, so three arms make 120 points labeled 0, 1, and 2. Radius grows from 0.05 to 1, and the angles are a third of a turn apart.

```numpy run expect="120 3" title="Point count"
import numpy as np
# Three arms
def arm(n, label):
    theta = np.linspace(0, 3.4, n) + label * (2 * np.pi / 3)
    radius = np.linspace(0.05, 1.0, n)
    pts = np.stack([radius * np.cos(theta), radius * np.sin(theta)], axis=1)
    return pts, np.full(n, label)
xa, ya = arm(40, 0)
xb, yb = arm(40, 1)
xc, yc = arm(40, 2)
X = np.concatenate([xa, xb, xc])
Y = np.concatenate([ya, yb, yc])
print(X.shape[0], len(set(Y.tolist())))
```

The print is 120 and 3.

### Separate the training points

The hidden width is 24. Initial values come from a linear congruential formula on the index, so they are fixed. Adam uses learning rate 0.08 for 150 full-batch updates. The snippet also prints ok when accuracy is at least 0.8.

```numpy run expect="ok" title="Spiral"
import numpy as np
from minitorch import nn, optim, tensor, cross_entropy
# Fixed init
def arm(n, label):
    theta = np.linspace(0, 3.4, n) + label * (2 * np.pi / 3)
    radius = np.linspace(0.05, 1.0, n)
    pts = np.stack([radius * np.cos(theta), radius * np.sin(theta)], axis=1)
    return pts, np.full(n, label)
xa, ya = arm(40, 0)
xb, yb = arm(40, 1)
xc, yc = arm(40, 2)
X = np.concatenate([xa, xb, xc])
Y = np.concatenate([ya, yb, yc])
net = nn.Sequential(nn.Linear(2, 24), nn.ReLU(), nn.Linear(24, 3))
for param in net.parameters():
    flat = param.data.reshape(-1)
    for i in range(flat.size):
        flat[i] = ((i * 17) % 100) / 100.0 - 0.5
opt = optim.Adam(net.parameters(), lr=0.08)
xt = tensor(X)
for _ in range(150):
    opt.zero_grad()
    loss = cross_entropy(net(xt), Y)
    loss.backward()
    opt.step()
pred = net(xt).data.argmax(axis=1)
acc = float((pred == Y).mean())
print("acc", round(acc, 3))
print("ok" if acc >= 0.8 else "low")
```

The last line is ok.

### This is only the training cloud

Accuracy is measured on the same points, with no held-out test set. A new set of angles or added noise will drop the number. The next chapter opens up the cross-entropy formula.
