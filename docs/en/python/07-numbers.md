---
language: python
chapter: 7
title: "Python Numbers"
level: beginner
minutes: 8
goals:
  - "Use abs and round"
  - "Take a square root with math"
  - "Keep a very large integer exact"
sources:
  - lxiy-python
updated: "2026-10-16"
---

Numbers are either integers or floats. An integer may be very long. A float has limited precision.

### Absolute value and rounding

`abs` removes a minus sign. `round` moves a float to an integer by the usual rule.

```python run expect="4 2" title="Absolute value"
print(abs(-4), round(1.6))
```

Those two calls print `4 2`.

### Square root

`math.sqrt` returns a float. The square root of the integer 9 comes back as 3.0.

```python run expect="3.0" title="Square root"
import math
print(math.sqrt(9))
```

The root is `3.0`.

### Large integers

A Python integer is not locked to 64 bits. Multiplying by a large factor still gives an exact integer.

```python run expect="1099511627776" title="To the fortieth power"
print(2 ** 40)
```

Two to the fortieth prints `1099511627776`.
