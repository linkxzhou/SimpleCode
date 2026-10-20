---
language: dl
chapter: 7
title: "A Fashion-MNIST subset"
level: intermediate
minutes: 10
goals:
  - "Read the first label in the subset"
  - "Train a small net on a few hundred images"
  - "See loss and acc in the terminal"
sources:
  - numpy-manual
  - fashion-mnist
updated: "2026-10-20"
---

The default dataset is a Fashion-MNIST subset: 5000 training images and 1000 test images, each 28 by 28 grayscale, across ten clothing classes. Zalando released the source under the MIT license. The runtime stores it at /data/fashion-mnist.bin, with attribution in /data/FASHION.txt.

### Label of the first image

datasets.fashion_mnist returns pixels scaled between 0 and 1, plus integer labels. The subset keeps the original order, and the first training label is 9.

```numpy run expect="label 9" title="Read a label"
from minitorch import datasets
# Pixels stay scaled
_, y, _, _ = datasets.fashion_mnist()
print("n", int(y.shape[0]))
print("label", int(y[0]))
```

The second line is label 9.

### Train a small net

Use 600 training images and 200 test images, with a hidden width of 32. The init is a fixed linear-congruential pattern. SGD uses learning rate 0.5, batch 80, and 3 epochs. The end of the run prints loss and acc.

```numpy run expect="acc" title="Train"
from minitorch import nn, optim, tensor, cross_entropy, datasets
# Minibatches
xtr, ytr, xte, yte = datasets.fashion_mnist(n_train=600, n_test=200)
net = nn.Sequential(nn.Linear(784, 32), nn.ReLU(), nn.Linear(32, 10))
for param in net.parameters():
    flat = param.data.reshape(-1)
    for i in range(flat.size):
        bit = (i * 1103515245 + 12345) & 0x7FFFFFFF
        flat[i] = ((bit % 10000) / 10000.0 - 0.5) * 0.08
opt = optim.SGD(net.parameters(), lr=0.5)
loss = None
for _ in range(3):
    for start in range(0, xtr.shape[0], 80):
        opt.zero_grad()
        logits = net(tensor(xtr[start:start + 80]))
        loss = cross_entropy(logits, ytr[start:start + 80])
        loss.backward()
        opt.step()
pred = net(tensor(xte)).data.argmax(axis=1)
acc = float((pred == yte).mean())
print("loss", round(loss.item(), 4))
print("acc", round(acc, 3))
```

The terminal shows both loss and acc.

### Ten classes

Labels 0 through 9 are t-shirt, trouser, pullover, dress, coat, sandal, shirt, sneaker, bag, and ankle boot. This small net only shows the loss moving. It is not a leaderboard model. Pixels come from Zalando Fashion-MNIST under the MIT license, and this repo vendors a subset.
