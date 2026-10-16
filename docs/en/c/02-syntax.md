---
language: c
chapter: 2
title: "C Basic Syntax"
level: beginner
minutes: 8
goals:
  - "End a statement with a semicolon"
  - "Wrap a block in braces"
  - "Write a comment with /* */"
sources:
  - learn-c
updated: "2026-10-16"
---

Each statement in a C function ends with a semicolon. Braces mark where a block starts and where it stops.

### Semicolon

The two `printf` calls are separate statements. Each one sits on its own line and ends with a semicolon.

```c run expect="甲" title="First line"
#include <stdio.h>
int main(void) {
  printf("甲\n");
  printf("乙\n");
  return 0;
}
```

The output contains `甲`.

### A block

The inner braces declare `m`, which exists only inside that block. The first `printf` writes `m`, and that value is 2.

```c run expect="2" title="2 inside the block"
#include <stdio.h>
int main(void) {
  int n = 1;
  {
    int m = 2;
    printf("%d\n", m);
  }
  printf("%d\n", n);
  return 0;
}
```

The output contains `2`.

### A comment

Text between `/*` and `*/` is ignored by the compiler. The `printf` inside that comment never runs, and the later call does.

```c run expect="留下" title="Skip the comment"
#include <stdio.h>
int main(void) {
  /* printf("隐藏\n"); */
  printf("留下\n");
  return 0;
}
```

The output contains `留下`.
