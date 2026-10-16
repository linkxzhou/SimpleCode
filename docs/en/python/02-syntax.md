---
language: python
chapter: 2
title: "Python Basic Syntax"
level: beginner
minutes: 8
goals:
  - "Mark a block with indentation"
  - "Write a function that returns a value"
  - "Keep one simple statement on a line"
sources:
  - lxiy-python
updated: "2026-10-16"
---

Python groups lines by indentation, not by braces. Statements at the same level must line up on the left.

### Indentation is the block

The body of a function sits one level deeper than `def`. Send a value back with `return`.

```python run expect="7" title="Add two numbers"
def add(a, b):
    return a + b
print(add(2, 5))
```

The call prints `7`.

### A colon starts the next level

The line after `if` or `for` must be indented. Otherwise the interpreter treats the block as empty.

```python run expect="正" title="A conditional block"
n = 2
if n > 0:
    print("正")
```

You will see `正`.

### One simple statement per line

A semicolon can squeeze two statements onto one line. In these lessons, still write one statement per line so the printed lines stay easy to match.

```python run expect="甲" title="Two lines of output"
print("甲")
print("乙")
```

The first printed line is `甲`.
