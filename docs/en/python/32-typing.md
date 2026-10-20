---
language: python
chapter: 32
title: "Python Type Annotations"
level: intermediate
minutes: 10
goals:
  - "Annotate parameters and the return"
  - "Mark a list of strings with list[str]"
  - "Read the annotations back with get_type_hints"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

Annotations live on the function __annotations__. The interpreter does not reject a mismatched argument because of them. Checking belongs in tests or an external tool.

### The annotation does not change the multiply

twice is marked int in and int out. What actually runs is still n * 2, and 4 times 2 is 8.

```python run expect="8" title="Times two"
def twice(n: int) -> int:
    return n * 2

print(twice(4))
```

The result is 8.

### An annotation on the list elements

list[str] says a series of strings is expected. first only reads index 0, so tea comes back unchanged.

```python run expect="tea" title="First name"
def first(items: list[str]) -> str:
    return items[0]

print(first(["tea", "cup"]))
```

The value read is tea.

### The annotation is still readable at runtime

get_type_hints maps the name points back to int. Printing the type __name__ produces the word int.

```python run expect="int" title="Read the hint"
from typing import get_type_hints

def score(name: str, points: int) -> str:
    return name

hints = get_type_hints(score)
print(hints["points"].__name__)
```

The annotation name for points is int.

### A wrong type is not blocked

Exercise: label is annotated as int, but the call passes tea. The body concatenates with str, so it still prints n=tea. That is an annotation not enforcing itself.

```python run expect="n=tea" title="Not enforced"
def label(n: int) -> str:
    return "n=" + str(n)

print(label("tea"))
```

The joined text is n=tea.

### The official tutorial is a link

The typing parts of the official Python tutorial are worth reading next. This chapter does not copy them: <https://docs.python.org/3/tutorial/>.
