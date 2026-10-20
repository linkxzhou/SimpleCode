---
language: python
chapter: 30
title: "Python Context Managers"
level: intermediate
minutes: 10
goals:
  - "Wrap a block with __enter__ and __exit__"
  - "Write the generator form with contextmanager"
  - "Swallow an exception inside __exit__"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

with calls __enter__ on the way in and __exit__ on the way out, whether the block succeeded or failed. It fits toggles, counters, and a temporary change of state.

### Take a word on the way in

Door.__enter__ hands open back to the name after with. This __exit__ does not intercept anything, so an exception would still propagate.

```python run expect="open" title="Enter"
class Door:
    def __enter__(self):
        return "open"
    def __exit__(self, exc_type, exc, tb):
        return False

with Door() as state:
    print(state)
```

The name after as is open.

### A generator can be the door

contextmanager treats the code before yield as the entrance, and the yielded value goes to as. Here tea is uppercased and handed out.

```python run expect="TEA" title="Decorate the name"
from contextlib import contextmanager

@contextmanager
def tag(name):
    yield name.upper()

with tag("tea") as label:
    print(label)
```

The handed-out label is TEA.

### Count the exit

Returning True from __exit__ means the exception is handled, so ValueError is not seen outside the with. closed increases by one, which shows the exit ran.

```python run expect="1" title="Swallow the error"
class Guard:
    def __init__(self):
        self.closed = 0
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc, tb):
        self.closed += 1
        return True

gate = Guard()
with gate:
    raise ValueError("x")
print(gate.closed)
```

The exit count is 1.

### Exercise: add one on enter and again on exit

Build a counter that adds 1 in __enter__ and adds 1 again in __exit__. After the with, the print should be 2. One version is below.

```python run expect="2" title="Add on both sides"
class Tally:
    def __init__(self):
        self.n = 0
    def __enter__(self):
        self.n += 1
        return self
    def __exit__(self, exc_type, exc, tb):
        self.n += 1
        return False

box = Tally()
with box:
    pass
print(box.n)
```

Both sides leave 2.

### The 100-day list has no license

The Python-100-Days repository declares no license, so it is further reading only and its code cannot be adapted: <https://github.com/jackfrued/Python-100-Days>.
