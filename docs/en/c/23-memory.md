---
language: c
chapter: 23
title: "C Memory Management"
level: beginner
minutes: 8
goals:
  - "Allocate with malloc"
  - "Call free when finished"
  - "Do not use a null pointer after a failed allocation"
sources:
  - learn-c
updated: "2026-10-16"
---

Every block from `malloc` must be passed to `free`. This run can show the stored value, but it cannot show a leak, so each sample still calls `free`.

### Allocate one integer

If `malloc` returns null, `main` returns 1. Otherwise the program stores 7, prints that `int`, and calls `free`.

```c run expect="7" title="7 on the heap"
#include <stdio.h>
#include <stdlib.h>
int main(void) {
  int *p = malloc(sizeof *p);
  if (!p) return 1;
  *p = 7;
  printf("%d\n", *p);
  free(p);
  return 0;
}
```

The output contains `7`.

### Allocate an array

The byte count is the element count times the size of one element. Two `int` values are stored, and their sum is 3.

```c run expect="3" title="Sum of two items"
#include <stdio.h>
#include <stdlib.h>
int main(void) {
  int *p = malloc(sizeof *p * 2);
  if (!p) return 1;
  p[0] = 1;
  p[1] = 2;
  printf("%d\n", p[0] + p[1]);
  free(p);
  return 0;
}
```

The output contains `3`.

### Do not dereference null

This sample does not force `malloc` to fail. It writes and prints only inside `if (p)`, when the pointer is not null.

```c run expect="4" title="Check first"
#include <stdio.h>
#include <stdlib.h>
int main(void) {
  int *p = malloc(sizeof *p);
  if (p) {
    *p = 4;
    printf("%d\n", *p);
    free(p);
  }
  return 0;
}
```

The output contains `4`.
