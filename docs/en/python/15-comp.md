---
language: python
chapter: 15
title: "Python Comprehensions"
level: beginner
minutes: 8
goals:
  - "Collect results with a list comprehension"
  - "Filter inside a comprehension"
  - "Sum with a generator expression"
sources:
  - lxiy-python
updated: "2026-10-16"
---

A comprehension folds a loop into one expression. Use it to build a fresh list, or pass it straight into a function.

### List the squares

Inside the brackets, write the result first and the `for` clause after it.

```python run expect="[0, 1, 4]" title="Three squares"
print([n * n for n in range(3)])
```

The list of squares is `[0, 1, 4]`.

### Keep only even numbers

Put `if` after `for`. An item that fails the test never enters the list.

```python run expect="[0, 2, 4]" title="Even numbers"
print([n for n in range(5) if n % 2 == 0])
```

The kept values are `[0, 2, 4]`.

### Sum a generator directly

Parentheses around the comprehension do not build the full list ahead of time. `sum` takes one number, then the next.

```python run expect="6" title="Sum from 0 to 3"
print(sum(n for n in range(4)))
```

The sum is `6`.
