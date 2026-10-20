---
language: dl
chapter: 3
title: "Autograd"
level: intermediate
minutes: 8
goals:
  - "Record a local gradient for multiplication"
  - "Differentiate a cube with minitorch"
  - "Check the gradient shape of a matrix product"
sources:
  - numpy-manual
updated: "2026-10-20"
---

Autograd stores a local derivative for each op, then multiplies them from the scalar loss backward. You do not write the full chain rule by hand.

### Local gradient of a product

When c = a * b, the gradient into a gains b and the gradient into b gains a. The tiny class below only shows that one step. Real training uses minitorch.

```numpy run expect="4.0 3.0" title="Local gradient"
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
# Product only
a = V(3.0)
b = V(4.0)
c = a * b
c.backward()
print(a.grad, b.grad)
```

The factors of 3 times 4 receive gradients 4 and 3.

### A cube

y = x**3 has derivative 3x^2 = 12 at x = 2. minitorch records that chain as repeated multiplies. After backward, read x.grad.

```numpy run expect="12.0" title="Cube"
from minitorch import tensor
# x starts at 2
x = tensor([2.0], requires_grad=True)
y = (x * x * x).sum()
y.backward()
print(round(float(x.grad[0]), 1))
```

The print is 12.0.

### Only a scalar can start backward

A vector-to-vector derivative is a matrix, and minitorch rejects that starting point. Sum or mean the value down to one number, then call backward. Each parameter grad matches the shape of data.
