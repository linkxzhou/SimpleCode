---
language: python
chapter: 11
title: "Python Dictionaries"
level: beginner
minutes: 8
goals:
  - "Read a value by its key"
  - "Test whether a key is present"
  - "Refuse a list as a key"
sources:
  - lxiy-python
updated: "2026-10-16"
---

A dictionary uses curly braces. You find a value by its key, not by position.

### Read by key

Write the key inside square brackets. A missing key raises `KeyError`.

```python run expect="18" title="Unit price"
price = {"tea": 18}
print(price["tea"])
```

The price stored under that key is `18`.

### get supplies a default

When the key is absent, `get` returns the default you prepared instead of stopping the program.

```python run expect="0" title="Missing key"
price = {"tea": 18}
print(price.get("water", 0))
```

The fallback is `0`.

### A key must be hashable

A list cannot serve as a key. Strings and integers can.

```python run expect="not a key" title="A list as a key"
try:
    {["tea"]: 18}
    print("passed")
except TypeError:
    print("not a key")
```

The failure message is `not a key`.
