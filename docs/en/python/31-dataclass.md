---
language: python
chapter: 31
title: "Python Dataclasses"
level: intermediate
minutes: 10
goals:
  - "Let dataclass generate comparison and printing"
  - "Block assignment with frozen"
  - "Give each object its own list with default_factory"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

dataclass builds __init__, __repr__, and __eq__ from the fields. Each field needs an annotation, and here that annotation exists for the decorator.

### Print the fields

Item has name and price. The generated repr writes both fields, in the order they were declared on the class.

```python run expect="Item(name='tea', price=4)" title="One card"
from dataclasses import dataclass

@dataclass
class Item:
    name: str
    price: int

print(Item("tea", 4))
```

The card text contains tea and 4.

### A frozen card rejects assignment

With frozen=True, fields can be set only when the object is created. The sample does not assign to a field; it only adds x and y.

```python run expect="3" title="Frozen point"
from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: int
    y: int

spot = Point(1, 2)
print(spot.x + spot.y)
```

The sum of the coordinates is 3.

### Each cart gets its own list

A bare [] default would be shared by every instance. default_factory=list asks for a new list when each Cart is created. After a stores tea, b is still empty.

```python run expect="0" title="Two carts"
from dataclasses import dataclass, field

@dataclass
class Cart:
    rows: list = field(default_factory=list)

first = Cart()
second = Cart()
first.rows.append("tea")
print(len(second.rows))
```

The second cart has length 0.

### Exercise: equality looks at the price

Two Item values are equal when their fields match. Comparing tea/4 with another tea/4 should print True.

```python run expect="True" title="Same price, equal"
from dataclasses import dataclass

@dataclass
class Item:
    name: str
    price: int

print(Item("tea", 4) == Item("tea", 4))
```

The comparison prints True.

### Think Python stays unadapted

Think Python is CC-BY-NC-SA, so this chapter only links it and does not adapt the text: <https://greenteapress.com/wp/think-python-3rd-edition/>.
