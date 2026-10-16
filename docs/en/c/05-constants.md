---
language: c
chapter: 5
title: "C Constants"
level: beginner
minutes: 8
goals:
  - "Mark a fixed variable with const"
  - "Name a literal with #define"
  - "Number a set with an enum"
sources:
  - learn-c
updated: "2026-10-16"
---

A constant tells the reader that the number should stay unchanged later in the function. `const`, `#define`, and `enum` are three ways to give such a number a name.

### const

A `const int` can be read. This book does not assign a new value to `boiling`.

```c run expect="100" title="Boiling point"
#include <stdio.h>
int main(void) {
  const int boiling = 100;
  printf("%d\n", boiling);
  return 0;
}
```

The output contains `100`.

### A macro

`#define` replaces `DOUBLE(3)` with text before `main` is compiled. Parentheses in the macro keep the multiplication grouped.

```c run expect="6" title="Double"
#include <stdio.h>
#define DOUBLE(x) ((x) * 2)
int main(void) {
  printf("%d\n", DOUBLE(3));
  return 0;
}
```

The output contains `6`.

### Enumerations start at zero

When the names omit numbers, the first enumerator is 0. Each following name is one greater, so `BLUE` is 2.

```c run expect="2" title="Index of blue"
#include <stdio.h>
enum Color { RED, GREEN, BLUE };
int main(void) {
  printf("%d\n", BLUE);
  return 0;
}
```

The output contains `2`.
