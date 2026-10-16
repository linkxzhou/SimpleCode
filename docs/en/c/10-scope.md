---
language: c
chapter: 10
title: "C Scope Rules"
level: beginner
minutes: 8
goals:
  - "Keep a local name inside its function"
  - "See an inner name hide the outer one"
  - "Treat a parameter as a local variable"
sources:
  - learn-c
updated: "2026-10-16"
---

A name begins at its declaration and lasts until that block ends. An inner block may declare the same name again.

### A parameter

The parameter `n` exists only inside `twice`. The call passes 4, and the function returns twice that value.

```c run expect="8" title="Parameter"
#include <stdio.h>
int twice(int n) { return n * 2; }
int main(void) {
  printf("%d\n", twice(4));
  return 0;
}
```

The output contains `8`.

### Shadowing inside a block

The inner `n` is a separate variable holding 2. After the closing brace, the outer `n` is still 1, and the first printed number is the inner one.

```c run expect="2" title="Inner name first"
#include <stdio.h>
int main(void) {
  int n = 1;
  {
    int n = 2;
    printf("%d\n", n);
  }
  printf("%d\n", n);
  return 0;
}
```

The output contains `2`.

### The outer name after the block

The inner block can still update the outer `n`. Adding the local `m` leaves 3 in that outer variable, which `printf` then writes.

```c run expect="3" title="Outer value updated"
#include <stdio.h>
int main(void) {
  int n = 1;
  {
    int m = 2;
    n = n + m;
  }
  printf("%d\n", n);
  return 0;
}
```

The output contains `3`.
