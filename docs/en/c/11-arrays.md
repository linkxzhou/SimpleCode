---
language: c
chapter: 11
title: "C Arrays"
level: beginner
minutes: 8
goals:
  - "Read and write with a subscript"
  - "Count elements with sizeof"
  - "Expect an array parameter to decay"
sources:
  - learn-c
updated: "2026-10-16"
---

The length is part of the declaration. Subscripts begin at 0.

### A subscript

The element at subscript 1 is the second item in the list. In `{8, 9, 10}` that item is 9.

```c run expect="9" title="Second element"
#include <stdio.h>
int main(void) {
  int a[3] = {8, 9, 10};
  printf("%d\n", a[1]);
  return 0;
}
```

The output contains `9`.

### The element count

`sizeof a` is the array's size in bytes. Dividing by `sizeof a[0]` gives the number of elements, which is 3.

```c run expect="3" title="Three elements"
#include <stdio.h>
int main(void) {
  int a[3] = {1, 2, 3};
  int n = (int)(sizeof a / sizeof a[0]);
  printf("%d\n", n);
  return 0;
}
```

The output contains `3`.

### Change one element

An assignment through a subscript writes into the original array. `a[0]` changes from 4 to 1.

```c run expect="1" title="Change the first element"
#include <stdio.h>
int main(void) {
  int a[2] = {4, 5};
  a[0] = 1;
  printf("%d\n", a[0]);
  return 0;
}
```

The output contains `1`.
