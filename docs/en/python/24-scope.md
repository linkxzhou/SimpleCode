---
language: python
chapter: 24
title: "Python Namespaces and Scope"
level: beginner
minutes: 8
goals:
  - "Tell a name inside a function from a name outside"
  - "See that an inner assignment leaves the outer name alone"
  - "Change the outer name only when you write global"
sources:
  - lxiy-python
updated: "2026-10-16"
---

The first assignment to a name inside a function binds that name to the function. Reading an outer name is allowed. A plain assignment does not rewrite the outer binding.

### A new name in the inner scope

Giving `city` a value inside the function leaves the outer `city` unchanged.

```python run expect="苏州 杭州" title="Neither side changes the other"
city = "杭州"
def show():
    city = "苏州"
    return city
print(show(), city)
```

The two cities are `苏州 杭州`.

### Read the outer name only

When the function never assigns to the name, the name it uses is the one from outside.

```python run expect="克" title="Read the outer name"
unit = "克"
def show():
    return unit
print(show())
```

The unit it reads is `克`.

### global writes the outer binding

After a `global` declaration, assignment inside the function writes at module level. Use that declaration sparingly, so a distant name is not altered in passing.

```python run expect="1" title="Change the outer name"
count = 0
def bump():
    global count
    count += 1
bump()
print(count)
```

After the call, the count is `1`.
