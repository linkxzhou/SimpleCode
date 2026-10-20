---
language: python
chapter: 31
title: "Python3 dataclass"
level: intermediate
minutes: 10
goals:
  - "用 dataclass 生成比较和打印"
  - "用 frozen 挡住赋值"
  - "用 default_factory 分开列表"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

dataclass 按字段生成 __init__、__repr__ 和 __eq__。字段要写类型标注，这里的标注只给装饰器用。

### 打印出字段

Item 有 name 和 price。生成的 repr 会把两个字段都写出来，顺序跟类里声明的一样。

```python run expect="Item(name='tea', price=4)" title="一张卡片"
from dataclasses import dataclass

@dataclass
class Item:
    name: str
    price: int

print(Item("tea", 4))
```

卡片文本里有 tea 和 4。

### 冻结之后不能改

frozen=True 之后，字段只能在创建时给定。下面不改字段，只把 x 和 y 加起来。

```python run expect="3" title="冻住的点"
from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: int
    y: int

spot = Point(1, 2)
print(spot.x + spot.y)
```

横纵坐标之和是 3。

### 每张购物车自己的列表

默认值如果直接写 []，会变成所有实例共用。default_factory=list 让每张 Cart 在创建时各自要一个新列表。a 放入 tea 以后，b 仍是空的。

```python run expect="0" title="两张购物车"
from dataclasses import dataclass, field

@dataclass
class Cart:
    rows: list = field(default_factory=list)

first = Cart()
second = Cart()
first.rows.append("tea")
print(len(second.rows))
```

第二张车的长度是 0。

### 练习：相等只看价格

两张 Item 只要字段相同就相等。下面比较 tea/4 和另一张 tea/4，应得到 True。

```python run expect="True" title="同价即相等"
from dataclasses import dataclass

@dataclass
class Item:
    name: str
    price: int

print(Item("tea", 4) == Item("tea", 4))
```

比较结果是 True。

### Think Python 不能改编

Think Python 是 CC-BY-NC-SA，这里只放链接，不改编正文：<https://greenteapress.com/wp/think-python-3rd-edition/> 。
