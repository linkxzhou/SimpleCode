---
language: dl
chapter: 3
title: "自动求导"
level: intermediate
minutes: 8
goals:
  - "用手写乘法记下局部梯度"
  - "用 minitorch 对三次方求导"
  - "确认矩阵乘的梯度形状"
sources:
  - numpy-manual
updated: "2026-10-20"
---

自动求导把每次运算的局部导数存下来，等损失是标量时从后往前乘。你不用再手写整条链式法则。

### 乘法的局部梯度

c = a * b 时，a 的梯度加上 b，b 的梯度加上 a。下面这个很小的类只为看清这一步，真正训练用 minitorch。

```numpy run expect="4.0 3.0" title="局部梯度"
class V:
    def __init__(self, data):
        self.data = data
        self.grad = 0.0
        self.kids = ()
        self.back = lambda: None
    def __mul__(self, other):
        out = V(self.data * other.data)
        def back():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out.back = back
        out.kids = (self, other)
        return out
    def backward(self):
        self.grad = 1.0
        order = []
        seen = set()
        def visit(node):
            if id(node) in seen:
                return
            seen.add(id(node))
            for kid in node.kids:
                visit(kid)
            order.append(node)
        visit(self)
        for node in reversed(order):
            node.back()
# 只演示乘法
a = V(3.0)
b = V(4.0)
c = a * b
c.backward()
print(a.grad, b.grad)
```

3 乘 4 的两个因子梯度是 4 和 3。

### 三次方

y = x**3 在 x = 2 处的导数是 3x^2 = 12。minitorch 用连续的乘法记下这条链，backward 之后读 x.grad。

```numpy run expect="12.0" title="三次方"
from minitorch import tensor
# x 从 2 出发
x = tensor([2.0], requires_grad=True)
y = (x * x * x).sum()
y.backward()
print(round(float(x.grad[0]), 1))
```

打印 12.0。

### 只有标量能回传

向量对向量的导数是矩阵，minitorch 拒绝这种起点。先 sum 或 mean 收成一个数，再调用 backward。参数的 grad 形状和 data 相同。
