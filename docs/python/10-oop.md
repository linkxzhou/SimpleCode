---
language: python
chapter: 10
title: "面向对象"
level: intermediate
minutes: 12
goals:
  - "定义类和构造方法"
  - "用继承复用行为"
  - "用 dataclass 少写样板"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

类把数据和操作放在一起。`__init__` 初始化实例属性。方法的第一个参数是实例自己，习惯叫 `self`。

子类可以覆盖方法。`dataclass` 会按字段自动生成初始化方法和可读的 `repr`。

```python run expect="Ada 125" title="账户"
class Account:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

acc = Account("Ada", 100)
acc.deposit(25)
print(acc.owner, acc.balance)
```

```python run expect="12" title="多态"
class Shape:
    def area(self):
        return 0

class Rect(Shape):
    def __init__(self, w, h):
        self.w = w
        self.h = h

    def area(self):
        return self.w * self.h

print(Rect(3, 4).area())
```

```python run expect="Point(x=1, y=2)" title="dataclass"
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

print(Point(1, 2))
```

## 练习

写一个 `Circle`，`area` 返回 `3 * r * r`（不用圆周率，方便核对），打印半径 3 的面积。

::: answer 参考答案：圆形
```python run expect="27" title="参考答案"
class Circle:
    def __init__(self, r):
        self.r = r

    def area(self):
        return 3 * self.r * self.r

print(Circle(3).area())
```
:::

## 常见错误

- 忘记 self。实例方法的第一个参数必须接收对象本身。
- 在类体里用可变默认值当全体实例共享的名单，却以为每人一份。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。
