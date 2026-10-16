---
language: python
chapter: 19
title: "Python Decorators"
level: beginner
minutes: 8
goals:
  - "Write a function that receives a function"
  - "Place @ above a function definition"
  - "Expect the wrapped name to change"
sources:
  - lxiy-python
updated: "2026-10-16"
---

A decorator receives a function and returns another function. The `@` line is a short way to call that decorator.

### Wrap by hand

Define an inner function, then return it. The original body runs only when that returned function is called.

```python run expect="你好!" title="Wrap by hand"
def shout(fn):
    def wrap():
        return fn() + "!"
    return wrap
def hi():
    return "你好"
print(shout(hi)())
```

The wrapped call prints `你好!`.

### Write @ above the definition

`@shout` has the same effect as the later assignment `hi = shout(hi)`.

```python run expect="你好!" title="Syntactic sugar"
def shout(fn):
    def wrap():
        return fn() + "!"
    return wrap
@shout
def hi():
    return "你好"
print(hi())
```

Calling `hi` prints `你好!`.

### The name becomes the inner function

Without copying metadata, `__name__` reports the wrapper's own name.

```python run expect="wrap" title="Function name"
def shout(fn):
    def wrap():
        return fn()
    return wrap
@shout
def hi():
    return "你好"
print(hi.__name__)
```

That reported name is `wrap`.
