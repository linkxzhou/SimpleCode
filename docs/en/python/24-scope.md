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

```python run expect="suzhou hangzhou" title="Neither side changes the other"
city = "hangzhou"
def show():
    city = "suzhou"
    return city
print(show(), city)
```

The two cities are `suzhou hangzhou`.

### Read the outer name only

When the function never assigns to the name, the name it uses is the one from outside.

```python run expect="gram" title="Read the outer name"
unit = "gram"
def show():
    return unit
print(show())
```

The unit it reads is `gram`.

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
