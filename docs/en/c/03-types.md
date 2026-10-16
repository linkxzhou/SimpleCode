---
language: c
chapter: 3
title: "C Data Types"
level: beginner
minutes: 8
goals:
  - "Distinguish int, double, and char"
  - "Expect integer division to drop the fraction"
  - "Measure bytes with sizeof"
sources:
  - learn-c
updated: "2026-10-16"
---

The type is fixed when the variable is declared. Dividing two `int` values does not follow the same rule as dividing `double` values.

### Integer division

Both operands of `20 / 6` have type `int`, so the quotient has type `int`. The fractional part of that division is discarded.

```c run expect="3" title="Quotient"
#include <stdio.h>
int main(void) {
  printf("%d\n", 20 / 6);
  return 0;
}
```

The output contains `3`.

### Decimal values

If either operand is a `double`, the quotient keeps a fraction. `%.1f` prints one digit after the decimal point.

```c run expect="3.5" title="Floating-point division"
#include <stdio.h>
int main(void) {
  printf("%.1f\n", 7.0 / 2.0);
  return 0;
}
```

The output contains `3.5`.

### sizeof

An `int` occupies several bytes. This program prints only `sizeof(char)`, and that size is 1.

```c run expect="1" title="One byte"
#include <stdio.h>
int main(void) {
  printf("%d\n", (int)sizeof(char));
  return 0;
}
```

The output contains `1`.
