---
language: python
chapter: 36
title: "Python Properties and Descriptors"
level: advanced
minutes: 11
goals:
  - "Reject a negative number with property"
  - "Clamp a value on assignment with a descriptor"
  - "Tell a descriptor object from the value on an instance"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

A property is written inside one class. A descriptor is a separate class stored as a class attribute, and it intercepts reads and writes of that attribute.

### A negative capacity becomes 0

The setter for Cup.ml turns a number below 0 into 0. The cup starts at 10, then receives -3, and the read should be 0.

```python run expect="0" title="Clamped capacity"
class Cup:
    def __init__(self, ml):
        self._ml = ml
    @property
    def ml(self):
        return self._ml
    @ml.setter
    def ml(self, value):
        self._ml = 0 if value < 0 else value

cup = Cup(10)
cup.ml = -3
print(cup.ml)
```

The read is 0.

### The descriptor remembers a private name

Positive.__set_name__ receives the field name gap when the class is created, and the real number lives in _gap. An assignment that is not positive is stored as 0. Meter(-4) therefore has gap 0.

```python run expect="0" title="Positive gate"
class Positive:
    def __set_name__(self, owner, name):
        self.private = "_" + name
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.private, 0)
    def __set__(self, obj, value):
        setattr(obj, self.private, value if value > 0 else 0)

class Meter:
    gap = Positive()
    def __init__(self, gap):
        self.gap = gap

print(Meter(-4).gap)
```

After clamping, the value is 0.

### Reading from the class returns the descriptor

When obj is None, __get__ returns the descriptor itself. Meter.gap is therefore a Positive instance, and its class name can be printed.

```python run expect="Positive" title="Attribute on the class"
class Positive:
    def __set_name__(self, owner, name):
        self.private = "_" + name
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.private, 0)
    def __set__(self, obj, value):
        setattr(obj, self.private, value if value > 0 else 0)

class Meter:
    gap = Positive()

print(type(Meter.gap).__name__)
```

The class name is Positive.

### Exercise: a blank name becomes anon

Use a property to turn an empty string into anon. Passing an empty string and reading it back should produce anon.

```python run expect="anon" title="Blank name"
class Badge:
    def __init__(self, name):
        self.name = name
    @property
    def name(self):
        return self._name
    @name.setter
    def name(self, value):
        self._name = value if value else "anon"

print(Badge("").name)
```

The empty name becomes anon.

### The later half of a beginner book

The later projects in Python Crash Course can serve as a route. Do not copy the code: <https://book.douban.com/subject/26829016>.
