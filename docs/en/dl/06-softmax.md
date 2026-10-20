---
language: dl
chapter: 6
title: "Softmax and cross-entropy"
level: intermediate
minutes: 8
goals:
  - "Make softmax entries add to 1"
  - "Compute one cross-entropy value"
  - "See a negative gradient on the correct class"
sources:
  - numpy-manual
updated: "2026-10-20"
---

Multiclass training should not fit the class id with mean squared error. Softmax turns logits into probabilities. Cross-entropy penalizes a correct-class probability that is still too small.

### Probabilities add to 1

Softmax subtracts the max, then exponentiates and normalizes. The three entries still add to 1 after any shift of the logits.

```numpy run expect="1.0" title="Normalize"
import numpy as np
from minitorch import softmax
# Three probabilities
logits = np.array([[2.0, 1.0, 0.1]])
print(round(float(softmax(logits).sum()), 4))
```

The print is 1.0.

### Negative log of the correct class

Label 0 means the first class. cross_entropy returns the negative log of that probability, averaged over the rows. With one row the value is about 0.2395.

```numpy run expect="0.2395" title="Cross-entropy"
from minitorch import tensor, cross_entropy
# Label 0
logits = tensor([[2.0, 0.0, 0.0]], requires_grad=True)
loss = cross_entropy(logits, [0])
print(round(loss.item(), 4))
```

Four decimal places read 0.2395.

### The gradient lifts the correct class

Backpropagating into the logits gives probability minus 1 on the correct class, which is negative. Other classes receive their positive probability. Subtracting that gradient raises the correct logit.
