---
language: python
chapter: 30
title: "Python3 with 上下文"
level: intermediate
minutes: 10
goals:
  - "用 __enter__ 和 __exit__ 包住一段"
  - "用 contextmanager 写生成器版"
  - "在 __exit__ 里吞掉异常"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

with 在进入时调用 __enter__，离开时无论成败都调用 __exit__。适合开关、计数和临时改状态。

### 进门拿到一个词

Door.__enter__ 把 open 交回 with 后面的名字。__exit__ 这里什么都不拦，异常会照常冒出去。

```python run expect="open" title="进门"
class Door:
    def __enter__(self):
        return "open"
    def __exit__(self, exc_type, exc, tb):
        return False

with Door() as state:
    print(state)
```

as 后面的名字是 open。

### 生成器也能当门

contextmanager 把 yield 之前当成进入，yield 的值交给 as。这里把 tea 收成大写再交出来。

```python run expect="TEA" title="装饰一下"
from contextlib import contextmanager

@contextmanager
def tag(name):
    yield name.upper()

with tag("tea") as label:
    print(label)
```

交出来的是 TEA。

### 离开时记下次数

__exit__ 返回 True 表示异常已经处理，with 外面不会再看到 ValueError。closed 加一，证明离开动作跑过了。

```python run expect="1" title="吞掉错误"
class Guard:
    def __init__(self):
        self.closed = 0
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc, tb):
        self.closed += 1
        return True

gate = Guard()
with gate:
    raise ValueError("x")
print(gate.closed)
```

离开计数是 1。

### 练习：进入加一离开再加一

做一个计数器，__enter__ 加 1，__exit__ 再加 1。with 走完应打印 2。下面是一种写法。

```python run expect="2" title="进出各加一"
class Tally:
    def __init__(self):
        self.n = 0
    def __enter__(self):
        self.n += 1
        return self
    def __exit__(self, exc_type, exc, tb):
        self.n += 1
        return False

box = Tally()
with box:
    pass
print(box.n)
```

两头加完是 2。

### 百日清单没有许可证

Python-100-Days 仓库没有声明许可证，只能当延伸阅读，不能改编里面的代码：<https://github.com/jackfrued/Python-100-Days> 。
