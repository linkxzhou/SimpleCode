---
language: python
chapter: 35
title: "Python3 魔术方法"
level: advanced
minutes: 11
goals:
  - "用 __len__ 和 __getitem__ 装成序列"
  - "用 __add__ 和 __str__ 做向量"
  - "用 __eq__ 按面值比较"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

魔术方法是解释器在特定语法下会去找的名字。len(obj) 找 __len__，obj[i] 找 __getitem__，加号找 __add__。

### 像序列一样取下标

Pocket 把名单藏在 items 里。len 和方括号不需要调用者知道这个字段，解释器会转到两个魔术方法。

```python run expect="2 cup" title="口袋"
class Pocket:
    def __init__(self, items):
        self.items = list(items)
    def __len__(self):
        return len(self.items)
    def __getitem__(self, index):
        return self.items[index]

pocket = Pocket(["tea", "cup"])
print(len(pocket), pocket[1])
```

长度和下标 1 是 `2 cup`。

### 加号返回新对象

Vec.__add__ 不改原来的两份，而是新造一个 Vec。__str__ 决定 print 时看到的文字，所以 v2 加 v3 显示 v5。

```python run expect="v5" title="向量相加"
class Vec:
    def __init__(self, x):
        self.x = x
    def __add__(self, other):
        return Vec(self.x + other.x)
    def __str__(self):
        return "v" + str(self.x)

print(Vec(2) + Vec(3))
```

相加后显示 v5。

### 相等看面值

Coin.__eq__ 只比较 n。两枚面值都是 5 的硬币，== 得到 True，尽管它们不是同一个对象。

```python run expect="True" title="两枚硬币"
class Coin:
    def __init__(self, n):
        self.n = n
    def __eq__(self, other):
        return self.n == other.n

print(Coin(5) == Coin(5))
```

面值相同，结果是 True。

### 练习：长度是名字个数

再写一个只实现 __len__ 的盒子，放进 elm 和 ash，len 应是 2。

```python run expect="2" title="两棵树"
class Grove:
    def __init__(self, names):
        self.names = list(names)
    def __len__(self):
        return len(self.names)

print(len(Grove(["elm", "ash"])))
```

树的棵数是 2。

### 百日仓库仍只链接

魔术方法在 Python-100-Days 里也有清单，那个仓库没有许可证，这里不改编：<https://github.com/jackfrued/Python-100-Days> 。
