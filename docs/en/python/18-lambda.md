---
language: python
chapter: 18
title: "Python Lambda"
level: beginner
minutes: 8
goals:
  - "Write a one-expression function with lambda"
  - "Pass that function to sorted"
  - "Keep statements out of a lambda"
sources:
  - lxiy-python
updated: "2026-10-16"
---

`lambda` suits a tiny function that fits on a single line. Leave heavier logic to `def`.

### Add two numbers

Whatever sits to the right of the colon is the value produced. `return` is not allowed there.

```python run expect="5" title="Anonymous function"
add = lambda a, b: a + b
print(add(2, 3))
```

The anonymous call prints `5`.

### Use it as a sort key

`sorted` consults `key` to decide which field to compare.

```python run expect="水" title="Sort by quantity"
rows = [("水", 2), ("茶", 9)]
rows = sorted(rows, key=lambda row: row[1])
print(rows[0][0])
```

The smaller quantity comes first, so the label is `水`.

### Several statements do not fit

An `if` block or a loop needs `def` instead. The sample only shows that a conditional expression can still live inside a lambda.

```python run expect="正" title="Conditional expression"
label = lambda n: "正" if n > 0 else "非正"
print(label(3))
```

The label for 3 is `正`.
