---
language: dl
chapter: 15
title: "学习率与早停"
level: intermediate
minutes: 9
goals:
  - "在损失变差时停下"
  - "把学习率减半再走一步"
  - "看较小学习率留下的参数"
sources:
  - micrograd
  - d2l-zh
updated: "2026-10-20"
---

早停看着验证损失。只要新的损失更小就更新最好的记录，一旦变差就停在这一步。学习率减半写在循环里，下一步用更小的 SGD 步长。平方损失的梯度是参数的两倍，所以步长可以手算核对。

### 在第三个数停下

损失是 5、3、4。3 比 5 好，4 比 3 差，所以停在下标 2，最好的损失是 3。打印 2 3。

```numpy run expect="2 3" title="早停"
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

### 两步之后是 1.5

参数从 4 开始，第一步学习率 0.25，梯度是 8，走到 2。学习率减半后第二步梯度是 4，再减去 0.5，落到 1.5。

```numpy run expect="1.5" title="减半步长"
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

### 小学习率停在 3.2

学习率 0.1 时，4 减去 0.1 乘 8，得到 3.2。步子比 0.25 更短，离 0 更远。

```numpy run expect="3.2" title="短步"
from minitorch import tensor, optim
w = tensor([4.0], requires_grad=True)
opt = optim.SGD([w], lr=0.1)
loss = (w * w).sum()
loss.backward()
opt.step()
print(round(float(w.data[0]), 1))
```

### 一直变好就走到最后

4、3、2 每次都更小。循环不会提前 break，停在最后的下标 2，最好的损失是 2。打印 2 2。

```numpy run expect="0 4" title="没有变差"
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
