---
language: c
chapter: 30
title: "C variadic arguments"
level: intermediate
minutes: 9
goals:
  - "Pull ints from a va_list"
  - "Find the maximum of a variable count"
  - "Require the caller to pass the count"
sources:
  - cppreference
updated: "2026-10-20"
---

`stdarg.h` lets a function accept more arguments after its fixed parameters. That tail has no length of its own, so the caller passes a count. Finish with `va_end`. These samples pass only `int`. A `float` would be promoted to `double` and must not be read as an int.

### Add three numbers

The first parameter of `sum` is the count. After `va_start`, the loop takes 1, then 2, then 4. The total is 7.

```c run expect="7" title="1+2+4"
#include <stdio.h>
#include <stdarg.h>
int sum(int n, ...) {
  va_list ap;
  int total = 0;
  int i;
  va_start(ap, n);
  for (i = 0; i < n; i++) total += va_arg(ap, int);
  va_end(ap);
  return total;
}
int main(void) {
  printf("%d\n", sum(3, 1, 2, 4));
  return 0;
}
```

The three numbers add up to 7.

### Keep the largest

The first extracted value becomes the current maximum, then each later value is compared with it. Among 3, 9, and 2 the largest is 9. The caller still supplies the count. The function cannot discover how many arguments were passed.

```c run expect="9" title="Largest is 9"
#include <stdio.h>
#include <stdarg.h>
int biggest(int n, ...) {
  va_list ap;
  int best;
  int i;
  va_start(ap, n);
  best = va_arg(ap, int);
  for (i = 1; i < n; i++) {
    int value = va_arg(ap, int);
    if (value > best) best = value;
  }
  va_end(ap);
  return best;
}
int main(void) {
  printf("%d\n", biggest(3, 3, 9, 2));
  return 0;
}
```

The largest value is 9.

### Read only the last one

When the count is 3, the first two values are overwritten by later reads and the third remains. The arguments are 5, 6, and 8, so 8 remains. Each `va_arg` moves forward by one argument.

```c run expect="8" title="The last argument"
#include <stdio.h>
#include <stdarg.h>
int last(int n, ...) {
  va_list ap;
  int value = 0;
  int i;
  va_start(ap, n);
  for (i = 0; i < n; i++) value = va_arg(ap, int);
  va_end(ap);
  return value;
}
int main(void) {
  printf("%d\n", last(3, 5, 6, 8));
  return 0;
}
```

The last extracted value is 8.

### Exercise: multiply them

`product` starts at 1 and multiplies. Two, three, and four produce 24. A count of zero would skip the loop and leave 1. This call passes three positive numbers.

```c run expect="24" title="2*3*4"
#include <stdio.h>
#include <stdarg.h>
int product(int n, ...) {
  va_list ap;
  int total = 1;
  int i;
  va_start(ap, n);
  for (i = 0; i < n; i++) total *= va_arg(ap, int);
  va_end(ap);
  return total;
}
int main(void) {
  printf("%d\n", product(3, 2, 3, 4));
  return 0;
}
```

The product is 24.
