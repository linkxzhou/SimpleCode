---
language: python
chapter: 29
title: "Python Iterator Protocol"
level: intermediate
minutes: 10
goals:
  - "Implement __iter__ and __next__"
  - "Split the cursor from the container"
  - "Raise StopIteration when the cursor is spent"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

Earlier chapters called iter and yield. This chapter writes the classes: the container hands out a cursor, and the cursor remembers how far it has walked.

### Count down three numbers

CountDown is its own cursor. __next__ returns the current number, then subtracts one from n. Another pull after zero raises StopIteration. list keeps pulling until that happens.

```python run expect="[3, 2, 1]" title="Countdown"
class CountDown:
    def __init__(self, start):
        self.n = start
    def __iter__(self):
        return self
    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        current = self.n
        self.n -= 1
        return current

print(list(CountDown(3)))
```

Three pulls produce `[3, 2, 1]`.

### Separate the bag from the cursor

Bag only stores the names. Each __iter__ builds a new Cursor, and the cursor __iter__ returns itself, or join will reject it. The same bag can be walked again from the start.

```python run expect="mint,bean" title="Two beans"
class Bag:
    def __init__(self, items):
        self.items = list(items)
    def __iter__(self):
        return Cursor(self.items)

class Cursor:
    def __init__(self, items):
        self.items = items
        self.i = 0
    def __iter__(self):
        return self
    def __next__(self):
        if self.i >= len(self.items):
            raise StopIteration
        value = self.items[self.i]
        self.i += 1
        return value

print(",".join(Bag(["mint", "bean"])))
```

The joined text is `mint,bean`.

### Call next twice by hand

Without list, take iter yourself and call next. Pair stores oak and then pine, and two next calls hand them out in that order.

```python run expect="oak pine" title="Two next calls"
class Pair:
    def __init__(self):
        self.left = ["oak", "pine"]
    def __iter__(self):
        return self
    def __next__(self):
        if not self.left:
            raise StopIteration
        return self.left.pop(0)

it = iter(Pair())
print(next(it), next(it))
```

The two pulls are oak and pine.

### Even steps

Exercise: write a cursor that starts at 2, adds 2 each time, and stops after 6. list should collect 2, 4, and 6. One version is below.

```python run expect="[2, 4, 6]" title="Even cursor"
class Evens:
    def __init__(self):
        self.n = 0
    def __iter__(self):
        return self
    def __next__(self):
        self.n += 2
        if self.n > 6:
            raise StopIteration
        return self.n

print(list(Evens()))
```

The collected values are `[2, 4, 6]`.

### A beginner book as an outline

Python Crash Course can pace the outline. Do not carry over its sentences or samples: <https://book.douban.com/subject/26829016>.
