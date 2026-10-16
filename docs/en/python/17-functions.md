---
language: python
chapter: 17
title: "Python Functions"
level: beginner
minutes: 8
goals:
  - "Define a function that takes parameters"
  - "Give a parameter a default value"
  - "Avoid a mutable object as a default"
sources:
  - lxiy-python
updated: "2026-10-16"
---

A function gives a name to a piece of computation. Arguments arrive by position.

### Define and call

Parameters go in the parentheses. The call supplies values in that same order.

```python run expect="12" title="Area"
def area(w, h):
    return w * h
print(area(3, 4))
```

The area is `12`.

### Default arguments

You may omit a parameter that already carries a default.

```python run expect="Hello, guest" title="Omit the name"
def greet(name="guest"):
    return "Hello, " + name
print(greet())
```

The greeting with no argument is `Hello, guest`.

### A mutable default remembers the last call

That default object is created once, at definition time. When it is a list, a later call still sees whatever the earlier call appended.

```python run expect="1 2" title="A shared default list"
def push(item, box=[]):
    box.append(item)
    return len(box)
print(push("tea"), push("water"))
```

The two lengths are `1 2`.
