---
language: python
chapter: 16
title: "Python Iterators and Generators"
level: beginner
minutes: 8
goals:
  - "Take values one by one with iter and next"
  - "Write a generator with yield"
  - "Accept that a generator does not rewind"
sources:
  - lxiy-python
updated: "2026-10-16"
---

An iterator hands over one further value each time you ask. A generator function pauses where it hits `yield`.

### next takes one value

`iter` turns a list into an iterator. `next` pulls only the item that is current.

```python run expect="7" title="The first"
it = iter([7, 8])
print(next(it))
```

The first pull is `7`.

### yield

Calling the generator function returns a generator object. The body does not run through to the end immediately.

```python run expect="1" title="Yield one"
def pairs():
    yield 1
    yield 2
print(next(pairs()))
```

The first yielded number is `1`.

### Another next fails when nothing remains

Once no value is left, `next` raises `StopIteration`.

```python run expect="gone" title="Exhausted"
it = iter([1])
next(it)
try:
    next(it)
    print("more")
except StopIteration:
    print("gone")
```

The message then is `gone`.
