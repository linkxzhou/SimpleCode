---
language: python
chapter: 35
title: "Python Magic Methods"
level: advanced
minutes: 11
goals:
  - "Look like a sequence with __len__ and __getitem__"
  - "Add and print a vector with __add__ and __str__"
  - "Compare face values with __eq__"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

Magic methods are names the interpreter looks up for particular syntax. len(obj) looks for __len__, obj[i] looks for __getitem__, and a plus sign looks for __add__.

### Index it like a sequence

Pocket hides the names in items. Callers of len and square brackets do not need to know that field; the interpreter forwards to the two magic methods.

```python run expect="2 cup" title="Pocket"
class Pocket:
    def __init__(self, items):
        self.items = list(items)
    def __len__(self):
        return len(self.items)
    def __getitem__(self, index):
        return self.items[index]

pocket = Pocket(["tea", "cup"])
print(len(pocket), pocket[1])
```

The length and index 1 print as `2 cup`.

### Plus returns a new object

Vec.__add__ does not mutate the two inputs. It builds a new Vec. __str__ decides the text print shows, so v2 plus v3 displays v5.

```python run expect="v5" title="Add vectors"
class Vec:
    def __init__(self, x):
        self.x = x
    def __add__(self, other):
        return Vec(self.x + other.x)
    def __str__(self):
        return "v" + str(self.x)

print(Vec(2) + Vec(3))
```

The sum displays v5.

### Equality looks at the face value

Coin.__eq__ compares only n. Two coins whose face value is 5 compare as True, even though they are not the same object.

```python run expect="True" title="Two coins"
class Coin:
    def __init__(self, n):
        self.n = n
    def __eq__(self, other):
        return self.n == other.n

print(Coin(5) == Coin(5))
```

Same face value, so the result is True.

### Exercise: length is the number of names

Write another box that only implements __len__, store elm and ash, and len should be 2.

```python run expect="2" title="Two trees"
class Grove:
    def __init__(self, names):
        self.names = list(names)
    def __len__(self):
        return len(self.names)

print(len(Grove(["elm", "ash"])))
```

The tree count is 2.

### The 100-day repo is still only a link

Magic methods are also listed in Python-100-Days. That repository has no license, so nothing is adapted from it: <https://github.com/jackfrued/Python-100-Days>.
