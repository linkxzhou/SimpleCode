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

```python run expect="除零" title="Catch it"
try:
    print(1 // 0)
except ZeroDivisionError:
    print("除零")
```

The handler prints `除零`.

### The caught type must match

A `ValueError` handler does not receive a division-by-zero error. Catch the class that was actually raised.

```python run expect="除零" title="The second branch"
try:
    1 // 0
    print("过了")
except ValueError:
    print("值错误")
except ZeroDivisionError:
    print("除零")
```

The matching branch prints `除零`.

### Raise on purpose

`raise` makes the caller handle the failure, or it stops the program at this point.

```python run expect="数量不够" title="Raise it yourself"
def sell(n):
    if n < 1:
        raise ValueError("数量不够")
    return n
try:
    sell(0)
except ValueError as err:
    print(err)
```

The message carried by the error is `数量不够`.
