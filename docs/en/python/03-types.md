---
language: python
chapter: 3
title: "Python Data Types"
level: beginner
minutes: 8
goals:
  - "Tell integers, floats, booleans, and strings apart"
  - "Read a type name with type"
  - "Treat an empty container as false"
sources:
  - lxiy-python
updated: "2026-10-16"
---

Every value has a type. The type decides which operations are allowed.

### Four common values

An integer, a float, a boolean, and a string may share one `print` call. Spaces separate the items.

```python run expect="int float bool" title="Type names"
print(type(3).__name__, type(1.5).__name__, type(True).__name__)
```

The names on that line are `int float bool`.

### Strings use quotes

Single quotes and double quotes both work. Characters inside the quotes are text, not a variable name.

```python run expect="tea" title="Text"
item = "tea"
print(item)
```

The variable prints `tea`.

### Empty values are false in a condition

`0`, an empty string, and an empty list all count as false. A non-empty number or piece of text counts as true.

```python run expect="False False True" title="True and false"
print(bool(0), bool(""), bool([1]))
```

The three results are `False False True`.
