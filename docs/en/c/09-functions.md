---
language: c
chapter: 9
title: "C Functions"
level: beginner
minutes: 8
goals:
  - "Declare each parameter and the return type"
  - "Report the result with a return value"
  - "Pass an array length separately"
sources:
  - learn-c
updated: "2026-10-16"
---

A C function names the type of every parameter. An array argument does not bring its length along.

### Return the sum

`add` returns `a + b` to the caller. `main` passes 2 and 3, then prints the returned `int`.

```c run expect="5" title="Add"
#include <stdio.h>
int add(int a, int b) { return a + b; }
int main(void) {
  printf("%d\n", add(2, 3));
  return 0;
}
```

The output contains `5`.

### No return value

A `void` function returns nothing. `show` prints its own message, and `main` only calls it.

```c run expect="好" title="No return value"
#include <stdio.h>
void show(void) { printf("好\n"); }
int main(void) {
  show();
  return 0;
}
```

The output contains `好`.

### Pass the length beside the array

Inside `sum`, the parameter `a` is a pointer to the first element. The caller passes 3 so the `for` loop knows when to stop.

```c run expect="6" title="Sum of three items"
#include <stdio.h>
int sum(const int *a, int n) {
  int i, total = 0;
  for (i = 0; i < n; i++) total += a[i];
  return total;
}
int main(void) {
  int a[3] = {1, 2, 3};
  printf("%d\n", sum(a, 3));
  return 0;
}
```

The output contains `6`.
