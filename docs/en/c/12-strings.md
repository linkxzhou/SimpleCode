---
language: c
chapter: 12
title: "C Strings"
level: beginner
minutes: 8
goals:
  - "Know that a string ends with a null character"
  - "Count bytes with strlen"
  - "Compare text with strcmp"
sources:
  - learn-c
updated: "2026-10-16"
---

A C string is a `char` array that ends with `\0`. `strlen` counts bytes.

### Length in bytes

`Hello!` occupies 6 bytes. `strlen` stops at the null and does not count it.

```c run expect="6" title="Six bytes"
#include <stdio.h>
#include <string.h>
int main(void) {
  printf("%d\n", (int)strlen("Hello!"));
  return 0;
}
```

The output contains `6`.

### Room for the copy

`strcpy` writes into an array the caller provides. `buf` has 8 bytes, enough for `tea` and the terminating null.

```c run expect="tea" title="Copy"
#include <stdio.h>
#include <string.h>
int main(void) {
  char buf[8];
  strcpy(buf, "tea");
  printf("%s\n", buf);
  return 0;
}
```

The output contains `tea`.

### Compare two strings

`strcmp` compares the bytes of both arguments. The two copies of `tea` match, so the return value is 0.

```c run expect="0" title="Equal"
#include <stdio.h>
#include <string.h>
int main(void) {
  printf("%d\n", strcmp("tea", "tea"));
  return 0;
}
```

The output contains `0`.
