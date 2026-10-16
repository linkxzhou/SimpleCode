---
language: python
chapter: 6
title: "Python Operators"
level: beginner
minutes: 8
goals:
  - "Tell / apart from //"
  - "Use comparison and logical operators"
  - "Write a power with **"
sources:
  - lxiy-python
updated: "2026-10-16"
---

Operators combine values into a new value. Division of integers and division of floats do not behave the same way.

### Division and floor division

`/` produces a float. `//` drops the remainder. `%` keeps only the remainder.

```python run expect="2 1" title="Quotient and remainder"
print(21 // 10, 21 % 10)
```

The quotient and the remainder are `2 1`.

### Comparison yields a boolean

`==` asks whether two values are equal. `!=` asks whether they differ.

```python run expect="True False" title="Compare"
print(3 > 1, 3 == 1)
```

The two answers are `True False`.

### Logic and powers

`and` is true only when both sides are true. `**` means exponentiation, not bitwise exclusive or.

```python run expect="8 False" title="Power"
print(2 ** 3, True and False)
```

The power and the logical result are `8 False`.
