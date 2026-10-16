---
language: python
chapter: 23
title: "Python3 面向对象"
level: beginner
minutes: 8
goals:
  - "用 class 定义类型"
  - "在方法里用 self 访问字段"
  - "用继承复用方法"
sources:
  - lxiy-python
updated: "2026-10-15"
---

类把数据和操作放在一起。方法的第一个参数是对象自己。

### 字段和方法

`__init__` 在创建对象时运行。方法通过 `self` 读字段。

```python run expect="7" title="喝一口"
class Cup:
    def __init__(self, ml):
        self.ml = ml
    def sip(self):
        return self.ml - 1
print(Cup(8).sip())
```

输出里能看到 `7`。

### 继承

子类不重写时，用的是父类的方法。

```python run expect="mug" title="沿用父类"
class Cup:
    def label(self):
        return "mug"
class Mug(Cup):
    pass
print(Mug().label())
```

输出里能看到 `mug`。

### 子类重写

子类定义同名方法后，调用子类对象会走到新的方法。

```python run expect="stein" title="覆盖"
class Cup:
    def label(self):
        return "mug"
class Mug(Cup):
    def label(self):
        return "stein"
print(Mug().label())
```

输出里能看到 `stein`。
