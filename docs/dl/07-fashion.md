---
language: dl
chapter: 7
title: "Fashion-MNIST 子集"
level: intermediate
minutes: 10
goals:
  - "读出子集里的第一枚标签"
  - "用小网络训练几百张图"
  - "在终端看到 loss 和 acc"
sources:
  - numpy-manual
  - fashion-mnist
updated: "2026-10-20"
---

默认数据集是 Fashion-MNIST 的子集：训练集 5000 张、测试集 1000 张，每张 28×28 灰度，十个服装类别。原数据由 Zalando 以 MIT 许可证发布。运行时把它放在 /data/fashion-mnist.bin，归因文字在 /data/FASHION.txt。

### 第一张的标签

datasets.fashion_mnist 读出已经归一化到 0 和 1 之间的像素，以及整数标签。子集按原顺序截取，第一张训练图的标签是 9。

```numpy run expect="label 9" title="读标签"
from minitorch import datasets
# 不改像素
_, y, _, _ = datasets.fashion_mnist()
print("n", int(y.shape[0]))
print("label", int(y[0]))
```

第二行是 label 9。

### 小网络训练

取 600 张训练图和 200 张测试图，隐藏层宽 32。初值由线性同余写死，SGD 学习率 0.5，批量 80，共 3 个 epoch。结束时打印 loss 和 acc。

```numpy run expect="acc" title="训练"
from minitorch import nn, optim, tensor, cross_entropy, datasets
# 小批量
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

终端里同时有 loss 和 acc。

### 十个类别

标签 0 到 9 依次是 T 恤、裤子、套头衫、裙子、外套、凉鞋、衬衫、运动鞋、包和短靴。这一小份网络只为看清损失下降，不追求排行榜上的准确率。像素来自 Zalando 的 Fashion-MNIST，MIT 许可证，本仓库只附带子集。
