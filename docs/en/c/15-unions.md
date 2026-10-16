---
language: c
chapter: 15
title: "C Unions"
level: beginner
minutes: 8
goals:
  - "Know that members share one memory region"
  - "Write a member and read that same member"
  - "Do not rely on another member's byte pattern"
sources:
  - learn-c
updated: "2026-10-16"
---

Members of a union overlap in one region of memory. The member written most recently is the one with a clear meaning when you read it.

### Write, then read

The sample stores 4 in the `int` member `i`. It then reads `i`, not the `double` member that shares those bytes.

```c run expect="4" title="Integer member"
#include <stdio.h>
union Num { int i; double d; };
int main(void) {
  union Num u;
  u.i = 4;
  printf("%d\n", u.i);
  return 0;
}
```

The output contains `4`.

### Room for the largest member

`sizeof` of a union is at least as large as its biggest member. This program only checks that the size is greater than zero, which prints 1.

```c run expect="1" title="Occupied space"
#include <stdio.h>
union Num { int i; double d; };
int main(void) {
  printf("%d\n", (int)(sizeof(union Num) > 0));
  return 0;
}
```

The output contains `1`.

### Write the member again

A later assignment to `i` replaces the earlier 1. Reading `i` after that second store returns 7.

```c run expect="7" title="Value written last"
#include <stdio.h>
union Num { int i; double d; };
int main(void) {
  union Num u;
  u.i = 1;
  u.i = 7;
  printf("%d\n", u.i);
  return 0;
}
```

The output contains `7`.
