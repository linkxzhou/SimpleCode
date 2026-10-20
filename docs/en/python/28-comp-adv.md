---
language: python
chapter: 28
title: "Python Comprehensions, Continued"
level: intermediate
minutes: 10
goals:
  - "Record names and lengths in a dict comprehension"
  - "Fold remainders with a set comprehension"
  - "Lay out coordinates with two for clauses"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

Brace comprehensions and a second for clause still put the result before the source. This chapter leaves square-bracket lists alone and practices dicts, sets, and a coordinate grid.

### Record a length under each name

The key sits left of the colon and the value sits right. In this short menu, tea has length 3 and cup has length 3, and both land in a fresh dict.

```python run expect="tea': 3" title="Names and lengths"
print({name: len(name) for name in ["tea", "cup"]})
```

The printed dict contains `tea': 3`.

### Drop duplicate remainders

A set swallows repeats. Remainders of 0 through 5 divided by 3 are only 0, 1, and 2. sorted keeps that display from wobbling.

```python run expect="[0, 1, 2]" title="Remainder set"
print(sorted({n % 3 for n in range(6)}))
```

The sorted remainders are `[0, 1, 2]`.

### Spread a coordinate grid

The outer name a takes 0 and 1, and the inner name b does the same. Four points enter one list, and the last point is (1, 1).

```python run expect="(1, 1)" title="Four points"
pairs = [(a, b) for a in range(2) for b in range(2)]
print(pairs[-1])
```

That last point prints as `(1, 1)`.

### Keep the pricier keys

Keep only keys whose price is at least 6, then print them in alphabetical order. tea at 4 drops out, while bun and cake stay. The block below is one way to do that exercise.

```python run expect="['bun', 'cake']" title="Filter by price"
prices = {"tea": 4, "cake": 9, "bun": 6}
kept = {k: v for k, v in prices.items() if v >= 6}
print(sorted(kept))
```

The sorted keys are `['bun', 'cake']`.

### A book to browse later

Fluent Python is an outline for difficulty only, not a source of sentences: <https://book.douban.com/subject/27028517>. The four programs above were written for this playground.
