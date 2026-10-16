---
language: c
chapter: 8
title: "C Loops"
level: beginner
minutes: 8
goals:
  - "Accumulate with for"
  - "Count down to zero with while"
  - "Leave a loop with break"
sources:
  - learn-c
updated: "2026-10-16"
---

C has `for`, `while`, and `do while`. A loop stops once its condition is false.

### for

`i` moves from 1 through 3, and `sum += i` adds each value. After the loop, `sum` holds 6.

```c run expect="6" title="Sum through 3"
#include <stdio.h>
int main(void) {
  int sum = 0;
  int i;
  for (i = 1; i <= 3; i++) sum += i;
  printf("%d\n", sum);
  return 0;
}
```

The output contains `6`.

### while

`left` starts at 2. Each pass subtracts one, so `left > 0` eventually fails and `printf` writes 0.

```c run expect="0" title="Count down to zero"
#include <stdio.h>
int main(void) {
  int left = 2;
  while (left > 0) left--;
  printf("%d\n", left);
  return 0;
}
```

The output contains `0`.

### break

The `while (1)` condition never becomes false by itself. `break` leaves when `n` reaches 3, and that value is what gets printed.

```c run expect="3" title="Stop at 3"
#include <stdio.h>
int main(void) {
  int n = 0;
  while (1) {
    n++;
    if (n == 3) break;
  }
  printf("%d\n", n);
  return 0;
}
```

The output contains `3`.
