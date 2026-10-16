---
language: c
chapter: 24
title: "C Error Handling"
level: beginner
minutes: 8
goals:
  - "Signal failure with a return value"
  - "Check that value in the caller"
  - "Do not use a result you have not checked"
sources:
  - learn-c
updated: "2026-10-16"
---

C has no exception type for an ordinary failure in program logic. The function returns a status, and the caller chooses the next step.

### Return a status

`sell` returns 1 when the quantity is below 1. `main` prints the status from `sell(0)`.

```c run expect="1" title="Failure"
#include <stdio.h>
int sell(int n) {
  if (n < 1) return 1;
  return 0;
}
int main(void) {
  printf("%d\n", sell(0));
  return 0;
}
```

The output contains `1`.

### Success returns zero

A quantity of 2 passes the test inside `sell`. That call returns 0.

```c run expect="0" title="Success"
#include <stdio.h>
int sell(int n) {
  if (n < 1) return 1;
  return 0;
}
int main(void) {
  printf("%d\n", sell(2));
  return 0;
}
```

The output contains `0`.

### Print after the check

`parse_ok` stores 18 through the pointer and returns 0. `main` prints `n` only because that status equals 0.

```c run expect="18" title="Use after the check"
#include <stdio.h>
int parse_ok(int *out) {
  *out = 18;
  return 0;
}
int main(void) {
  int n = 0;
  if (parse_ok(&n) == 0) printf("%d\n", n);
  return 0;
}
```

The output contains `18`.
