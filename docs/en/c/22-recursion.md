---
language: c
chapter: 22
title: "C Recursion"
level: beginner
minutes: 8
goals:
  - "Write a function that calls itself"
  - "Include a base case"
  - "Keep the depth small"
sources:
  - learn-c
updated: "2026-10-16"
---

A recursive function needs one branch that does not call itself. Arguments in this book stay within a single digit.

### Factorial

`fact` multiplies `n` by `fact(n - 1)` until the argument is 1 or less. `fact(4)` returns 24.

```c run expect="24" title="Factorial of four"
#include <stdio.h>
int fact(int n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
}
int main(void) {
  printf("%d\n", fact(4));
  return 0;
}
```

The output contains `24`.

### The base case

When `n <= 1`, `fact` returns 1 immediately. The call `fact(1)` stops there and does not call `fact` again.

```c run expect="1" title="Stop"
#include <stdio.h>
int fact(int n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
}
int main(void) {
  printf("%d\n", fact(1));
  return 0;
}
```

The output contains `1`.

### A recursive sum

`sum_to` adds `n` to the sum of the integers below it. The call `sum_to(4)` returns 10.

```c run expect="10" title="Sum from one to four"
#include <stdio.h>
int sum_to(int n) {
  if (n <= 1) return n;
  return n + sum_to(n - 1);
}
int main(void) {
  printf("%d\n", sum_to(4));
  return 0;
}
```

The output contains `10`.
