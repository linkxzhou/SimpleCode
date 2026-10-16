---
language: c
chapter: 21
title: "C Type Casting"
level: beginner
minutes: 8
goals:
  - "Truncate a fraction to an int"
  - "Cast an int to double before dividing"
  - "Know that a cast does not round"
sources:
  - learn-c
updated: "2026-10-16"
---

Write a cast explicitly in the source. Casting a `double` to `int` drops the fraction.

### Drop the fraction

`(int)3.9` keeps 3 and drops the fraction. Rounding that value would have produced 4.

```c run expect="3" title="Truncate"
#include <stdio.h>
int main(void) {
  double f = 3.9;
  printf("%d\n", (int)f);
  return 0;
}
```

The output contains `3`.

### Divide after the cast

`(double)a / 2` converts `a` before dividing. The printed quotient is 3.5.

```c run expect="3.5" title="Keep the fraction"
#include <stdio.h>
int main(void) {
  int a = 7;
  printf("%.1f\n", (double)a / 2);
  return 0;
}
```

The output contains `3.5`.

### The character code

Casting the character `'A'` to `int` yields its code. In ASCII that code is 65.

```c run expect="65" title="Character code"
#include <stdio.h>
int main(void) {
  printf("%d\n", (int)'A');
  return 0;
}
```

The output contains `65`.
