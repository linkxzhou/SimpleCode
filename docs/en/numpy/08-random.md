---
language: numpy
chapter: 8
title: "Random numbers"
level: beginner
minutes: 8
goals:
  - "Seed default_rng"
  - "Keep drawn integers inside a range"
  - "Repeat a stream from the same seed"
sources:
  - numpy-manual
updated: "2026-10-20"
---

New code should call np.random.default_rng instead of the global np.random.seed. The generator keeps its own state, so the same seed repeats the same stream.

### Integers stay in range

The high bound of integers is exclusive. Four draws from 0 up to 10 should each be at least 0 and below 10.

```numpy run expect="True" title="Range check"
import numpy as np
# Seed 7
rng = np.random.default_rng(7)
draw = rng.integers(0, 10, size=4)
print(bool(draw.min() >= 0 and draw.max() <= 9 and draw.size == 4))
```

A passing check prints True.

### The same seed repeats

Two default_rng(7) objects produce the same first random stream. Put the seed in the example if someone else should see the same numbers.

```numpy run expect="True" title="Repeatable"
import numpy as np
# Compare two streams
a = np.random.default_rng(7).random(5)
b = np.random.default_rng(7).random(5)
print(bool(np.array_equal(a, b)))
```

Equality prints True.

### Do not mix in the global seed

np.random.rand uses a different global state and ignores default_rng. Teaching snippets stay on the generator object so two seed systems do not stack.
