---
language: python
chapter: 20
title: "Python Modules"
level: beginner
minutes: 8
goals:
  - "Import a module from the standard library"
  - "Treat this page as the only source file"
  - "Detect the entry point with __name__"
sources:
  - lxiy-python
updated: "2026-10-16"
---

A module is a Python file that other code can import. This drawer will not open a second file from your computer.

### Import the standard library

Write the module name after `import`. A dot then selects a function inside it.

```python run expect="3" title="Ceiling"
import math
print(math.ceil(2.1))
```

The ceiling of 2.1 is `3`.

### A neighboring file is missing

There is no `shop.py` beside this program. Read the import below, and do not run it.

```python norun title="This module is absent"
import shop
```

### The main-program marker

Running this file directly sets `__name__` to `__main__`. Importing the same file from elsewhere does not.

```python run expect="True" title="This file is the entry"
print(__name__ == "__main__")
```

The comparison is `True`.
