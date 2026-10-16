---
language: python
chapter: 23
title: "Python Object-Oriented Programming"
level: beginner
minutes: 8
goals:
  - "Define a type with class"
  - "Read a field through self in a method"
  - "Reuse a method through inheritance"
sources:
  - lxiy-python
updated: "2026-10-16"
---

A class keeps data and operations together. The first parameter of a method is the object itself.

### Fields and methods

`__init__` runs when the object is created. A method reads a field through `self`.

```python run expect="7" title="Take a sip"
class Cup:
    def __init__(self, ml):
        self.ml = ml
    def sip(self):
        return self.ml - 1
print(Cup(8).sip())
```

One sip leaves `7`.

### Inheritance

If the child class does not replace a method, calls use the parent's version.

```python run expect="杯子" title="Keep the parent method"
class Cup:
    def label(self):
        return "杯子"
class Mug(Cup):
    pass
print(Mug().label())
```

The inherited label is `杯子`.

### The subclass replaces a method

Once the child defines a method of the same name, a call on a child object reaches that new method.

```python run expect="马克杯" title="Override"
class Cup:
    def label(self):
        return "杯子"
class Mug(Cup):
    def label(self):
        return "马克杯"
print(Mug().label())
```

The replacement label is `马克杯`.
