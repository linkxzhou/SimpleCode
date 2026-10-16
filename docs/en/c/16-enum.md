---
language: c
chapter: 16
title: "C enum"
level: beginner
minutes: 8
goals:
  - "Name a set of integers"
  - "Count upward from zero"
  - "Use an enumeration in switch"
sources:
  - learn-c
updated: "2026-10-16"
---

An enumeration gives names to integers. If you omit the numbers, they start at 0 and increase by one.

### Default numbers

`MON` is first and has no explicit value, so it is 0. `TUE` follows it, which makes `TUE` equal to 1.

```c run expect="1" title="Tuesday"
#include <stdio.h>
enum Day { MON, TUE };
int main(void) {
  printf("%d\n", TUE);
  return 0;
}
```

The output contains `1`.

### An explicit value

You may write a number on one of the names. `OK` is defined as 200, and `printf` writes that number.

```c run expect="200" title="Set to 200"
#include <stdio.h>
enum Status { OK = 200 };
int main(void) {
  printf("%d\n", OK);
  return 0;
}
```

The output contains `200`.

### Use it in switch

An enumerator can be the controlling expression of a `switch`. `d` holds `TUE`, so the matching case prints.

```c run expect="two" title="Second day"
#include <stdio.h>
enum Day { MON = 1, TUE = 2 };
int main(void) {
  enum Day d = TUE;
  switch (d) {
    case MON: printf("one\n"); break;
    case TUE: printf("two\n"); break;
  }
  return 0;
}
```

The output contains `two`.
