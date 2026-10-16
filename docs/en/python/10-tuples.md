---
language: python
chapter: 10
title: "Python Tuples"
level: beginner
minutes: 8
goals:
  - "Write a tuple with parentheses"
  - "Leave a tuple item unchanged by index"
  - "Unpack several names at once"
sources:
  - lxiy-python
updated: "2026-10-16"
---

A tuple keeps items in order. After you create it, one item cannot be replaced.

### Read an entry

Values inside parentheses are fetched by index. Counting still begins at zero.

```python run expect="8" title="The first item"
pair = (8, 9)
print(pair[0])
```

The first entry is `8`.

### One item cannot be replaced

Assigning through an index on a tuple fails. Switch to a list when the contents must change.

```python run expect="不能改" title="Read only"
pair = (8, 9)
try:
    pair[0] = 1
    print("改了")
except TypeError:
    print("不能改")
```

The error path prints `不能改`.

### Unpack

Put the same number of names on the left. The tuple on the right is assigned by position.

```python run expect="茶 18" title="Two names"
name, price = ("茶", 18)
print(name, price)
```

The two values are `茶 18`.
