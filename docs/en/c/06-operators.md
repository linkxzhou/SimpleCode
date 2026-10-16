---
language: c
chapter: 6
title: "C Operators"
level: beginner
minutes: 8
goals:
  - "Use the remainder operator"
  - "Use a comparison"
  - "Write ++ as its own statement"
sources:
  - learn-c
updated: "2026-10-16"
---

A comparison produces 0 or 1. In this chapter, `++` is its own statement.

### The remainder

`%` yields the remainder of an integer division. `21 % 10` leaves 1.

```c run expect="1" title="Remainder"
#include <stdio.h>
int main(void) {
  printf("%d\n", 21 % 10);
  return 0;
}
```

The output contains `1`.

### A comparison

The test `3 > 1` is true, so the expression's value is 1. `printf` writes that `int` with `%d`.

```c run expect="1" title="Greater than"
#include <stdio.h>
int main(void) {
  printf("%d\n", 3 > 1);
  return 0;
}
```

The output contains `1`.

### Increment

`n++` stores one more than the current value of `n`. Here `n` starts at 21.

```c run expect="22" title="Add one"
#include <stdio.h>
int main(void) {
  int n = 21;
  n++;
  printf("%d\n", n);
  return 0;
}
```

The output contains `22`.
