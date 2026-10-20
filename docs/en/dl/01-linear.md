---
language: dl
chapter: 1
title: "Linear regression"
level: beginner
minutes: 8
goals:
  - "Solve slope and intercept with least squares"
  - "Nudge parameters with gradient steps"
  - "Predict with the fitted line"
sources:
  - numpy-manual
updated: "2026-10-20"
---

The line y = wx + b summarizes a set of points with two numbers. Least squares solves them at once. Gradient steps walk there instead.

### Least squares

Stack x beside a column of ones. np.linalg.lstsq returns the slope and the intercept. The points (1, 3), (2, 5), and (3, 7) sit on y = 2x + 1.

```numpy run expect="2.0 1.0" title="Closed form"
import numpy as np
# Design matrix
x = np.array([1.0, 2.0, 3.0])
y = np.array([3.0, 5.0, 7.0])
A = np.stack([x, np.ones_like(x)], axis=1)
coef, _, _, _ = np.linalg.lstsq(A, y, rcond=None)
print(round(float(coef[0]), 4), round(float(coef[1]), 4))
```

The two coefficients are 2.0 and 1.0.

### Predict with the line

Slope 2 and intercept 1 score x = 4 as 2*4 + 1 = 9. Treat the bias as a weight on a constant 1 and one dot product finishes the job.

```numpy run expect="9.0" title="Predict"
import numpy as np
# x is 4
print(float(np.array([2.0, 1.0]) @ np.array([4.0, 1.0])))
```

The output is 9.0.

### Gradient steps are the other road

Start at w = 0 and b = 0, accumulate error times x on each point, then update with a learning rate. Enough steps approach 2 and 1, but not in a single closed-form jump. A huge learning rate oscillates around the answer.
