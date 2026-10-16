---
language: c
chapter: 13
title: "C Pointers"
level: beginner
minutes: 8
goals:
  - "Take an address with &"
  - "Read the target with *"
  - "Change the original variable through the pointer"
sources:
  - learn-c
updated: "2026-10-16"
---

A pointer holds an address. Dereference it only after it points at a real variable.

### Read through the pointer

`&n` is the address of `n`, and `p` stores that address. The `*` operator reads the `int` there, which is 9.

```c run expect="9" title="Points at 9"
#include <stdio.h>
int main(void) {
  int n = 9;
  int *p = &n;
  printf("%d\n", *p);
  return 0;
}
```

The output contains `9`.

### Change the original variable

An assignment through `*p` writes into `n` itself. After `*p = 8`, printing `n` shows the new value.

```c run expect="8" title="Change to 8"
#include <stdio.h>
int main(void) {
  int n = 3;
  int *p = &n;
  *p = 8;
  printf("%d\n", n);
  return 0;
}
```

The output contains `8`.

### Change the caller's variable

`inc` receives a pointer so it can update the caller's `int`. `main` passes `&n`, and `n` changes from 10 to 11.

```c run expect="11" title="Add one"
#include <stdio.h>
void inc(int *p) { *p = *p + 1; }
int main(void) {
  int n = 10;
  inc(&n);
  printf("%d\n", n);
  return 0;
}
```

The output contains `11`.
