---
language: python
chapter: 4
title: "Python Type Conversion"
level: beginner
minutes: 8
goals:
  - "Convert explicitly with int and float"
  - "Turn a number into text with str"
  - "Catch a failed conversion"
sources:
  - lxiy-python
updated: "2026-10-16"
---

Python will not quietly treat a string as a number and add it. When you want a conversion, write the target type.

### Text becomes an integer

`int` accepts only text that looks like an integer. A decimal point makes it fail.

```python run expect="13" title="Add one"
print(int("12") + 1)
```

Adding one to twelve prints `13`.

### Drop the fractional part

When `int` is applied to a float, it cuts off the fraction. It does not round.

```python run expect="3" title="Truncate"
print(int(3.9))
```

Truncating 3.9 prints `3`.

### Catch a failed conversion

Illegal text raises `ValueError`. After you catch it, the program can still print.

```python run expect="failed" title="Invalid text"
try:
    int("no")
    print("passed")
except ValueError:
    print("failed")
```

The handler prints `failed`.
