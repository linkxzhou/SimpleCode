---
language: dl
chapter: 10
title: "A short look at attention"
level: advanced
minutes: 8
goals:
  - "Weight values with a scaled dot product"
  - "Turn equal scores into equal weights"
  - "Remember the scale is the square root of the key length"
sources:
  - numpy-manual
updated: "2026-10-20"
---

Attention uses query-key dots to decide how much of each value to keep. Dividing by the square root of the key length keeps those dots from growing just because the vectors got longer.

### Scaled dot product

The query sits closer to the first key, so the value 5 outweighs the value 9. The weighted sum is about 6.321, between 5 and 9 and nearer to 5.

```numpy run expect="6.321" title="Weighted sum"
import numpy as np
# Two keys
q = np.array([[1.0, 0.0]])
k = np.array([[1.0, 0.0], [0.0, 1.0]])
v = np.array([[5.0], [9.0]])
scores = (q @ k.T) / np.sqrt(k.shape[1])
weights = np.exp(scores - scores.max())
weights = weights / weights.sum()
out = weights @ v
print(round(float(out[0, 0]), 3))
```

Three decimal places read 6.321.

### Equal scores get equal weights

Three identical scores become one third each after softmax. Rounded to four places that is 0.3333. No position is amplified.

```numpy run expect="0.3333" title="Even weights"
import numpy as np
# Three ties
scores = np.array([1.0, 1.0, 1.0])
weights = np.exp(scores) / np.exp(scores).sum()
print(round(float(weights[0]), 4))
```

The print is 0.3333.

### There is no multi-head split here

A full attention block also splits channels into heads, adds positions, and stacks many layers. This glance keeps only queries, keys, values, and one softmax. The scale uses the key length, which is the square root of 2 in the example.
