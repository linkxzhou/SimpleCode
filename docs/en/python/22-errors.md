---
language: python
chapter: 22
title: "Python Errors and Exceptions"
level: beginner
minutes: 8
goals:
  - "Catch an exception with try"
  - "Tell exception types apart"
  - "Report a failure with raise"
sources:
  - lxiy-python
updated: "2026-10-16"
---

An exception means this step cannot be completed. Catch it and the program can take another branch.

### Catch division by zero

Integer division by zero raises `ZeroDivisionError`.

```python run expect="divzero" title="Catch it"
try:
    print(1 // 0)
except ZeroDivisionError:
    print("divzero")
```

The handler prints `divzero`.

### The caught type must match

A `ValueError` handler does not receive a division-by-zero error. Catch the class that was actually raised.

```python run expect="divzero" title="The second branch"
try:
    1 // 0
    print("passed")
except ValueError:
    print("bad value")
except ZeroDivisionError:
    print("divzero")
```

The matching branch prints `divzero`.

### Raise on purpose

`raise` makes the caller handle the failure, or it stops the program at this point.

```python run expect="not enough" title="Raise it yourself"
def sell(n):
    if n < 1:
        raise ValueError("not enough")
    return n
try:
    sell(0)
except ValueError as err:
    print(err)
```

The message carried by the error is `not enough`.
