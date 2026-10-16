---
language: python
chapter: 1
title: "Python Environment Setup"
level: beginner
minutes: 8
goals:
  - "Separate a run on this page from a local install"
  - "Leave pip outside the Run button"
  - "Import the standard library with no extra download"
sources:
  - lxiy-python
updated: "2026-10-16"
---

On your own machine you install an interpreter and set up the command. In this drawer the interpreter is already here.

### No extra install

Press Run and the current text goes to that prepared interpreter. There is no installer from python.org.

```python run expect="已就绪" title="Run directly"
print("已就绪")
```

The result reads `已就绪`.

### pip is not in the button

`pip install` is a terminal command, not a Python statement. Putting it in the source does not download a package.

```python norun title="This is not source"
pip install requests
```

### The standard library ships with the interpreter

A module such as `math` does not need a separate download.

```python run expect="3" title="Floor"
import math
print(math.floor(3.9))
```

Flooring 3.9 prints `3`.
