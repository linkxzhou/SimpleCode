---
language: python
chapter: 34
title: "Python itertools and functools"
level: intermediate
minutes: 11
goals:
  - "Build prefix sums with accumulate"
  - "Group rows with groupby"
  - "Bind arguments with partial and cache calls with lru_cache"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

itertools works over values you already have, and functools works on the functions themselves. Neither side needs a network or a file.

### Prefix sums

accumulate adds by default. The prefix sums of 1, 2, 3 are 1, then 1+2, then 1+2+3.

```python run expect="[1, 3, 6]" title="Running total"
from itertools import accumulate
print(list(accumulate([1, 2, 3])))
```

The prefix sums are `[1, 3, 6]`.

### A group holds adjacent rows with the same key

groupby only bundles rows that are adjacent and share a key. Sort by the key first, or the two a rows would not sit together. The key here is the first letter of each row.

```python run expect="ab" title="Two group keys"
from itertools import groupby
rows = [("a", 1), ("a", 2), ("b", 3)]
keys = [k for k, _group in groupby(rows, key=lambda row: row[0])]
print("".join(keys))
```

The keys join into ab.

### Fix one factor first

partial(mul, 2) returns a function that still waits for the second argument. double(5) is 2 times 5.

```python run expect="10" title="Fixed double"
from functools import partial

def mul(a, b):
    return a * b

double = partial(mul, 2)
print(double(5))
```

Twice 5 is 10.

### Exercise: cache a Fibonacci function

lru_cache computes each n once. fib(6) is 8, and 0 through 6 are each computed once, so the counter is 7.

```python run expect="8 7" title="Calls after caching"
from functools import lru_cache

calls = {"n": 0}

@lru_cache(maxsize=8)
def fib(n):
    calls["n"] += 1
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(6), calls["n"])
```

The value and the call count are `8 7`.

### Another glance at Fluent Python

These tools also have chapters in Fluent Python. That book remains an outline only: <https://book.douban.com/subject/27028517>.
