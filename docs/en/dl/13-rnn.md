---
language: dl
chapter: 13
title: "A small recurrent net"
level: advanced
minutes: 9
goals:
  - "Walk two tanh steps to 0.363"
  - "Take only the first step and see 0.762"
  - "Write the pre-activation linear part with tensors"
sources:
  - d2l-zh
  - nn-zero-to-hero
updated: "2026-10-20"
---

A recurrent cell multiplies the previous state by a coefficient, adds the current input, and applies tanh. minitorch has no tanh, so the nonlinearity uses NumPy and the linear mix is written with tensors. The weights are constants and are not trained here.

### After two steps the state is 0.363

The first input is 1, so the state becomes tanh(1). The second input is 0, leaving half of the old state. Rounded to three decimals it is 0.363.

```numpy run expect="0.363" title="Two recurrent steps"
import numpy as np
h = 0.0
for x in (1.0, 0.0):
    h = np.tanh(0.5 * h + x)
print(round(float(h), 3))
```

### The first step is 0.762

With only the input 1, tanh(1) is about 0.762. Comparing it with the two-step result shows that the second step shrinks the state.

```numpy run expect="0.762" title="One step"
import numpy as np
h = 0.0
for x in (1.0,):
    h = np.tanh(0.5 * h + x)
print(round(float(h), 3))
```

### The pre-activation is 1.0

The state starts at 0, the input is 1, and its coefficient is 1. The linear part h*0.5 + x*1 equals 1.0. tanh stays in the other examples.

```numpy run expect="1.0" title="Linear part"
from minitorch import tensor
h = tensor([0.0])
x = tensor([1.0])
wh = tensor([0.5])
wx = tensor([1.0])
pre = h * wh + x * wx
print(round(float(pre.data[0]), 1))
```

### Zero first, then one

The order becomes 0 then 1. The first step leaves the state at 0, and the second step is tanh(1), which prints 0.762. Order and value agree.

```numpy run expect="0.762" title="Swap the order"
import numpy as np
h = 0.0
for x in (0.0, 1.0):
    h = np.tanh(0.5 * h + x)
print(round(float(h), 3))
```
