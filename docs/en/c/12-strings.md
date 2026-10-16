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

A C string is a `char` array that ends with `\0`. `strlen` counts bytes, not the number of Chinese characters.

### Length in bytes

The characters `你好` occupy 6 bytes in UTF-8. `strlen` stops at the null and does not count it.

```c run expect="6" title="Six bytes"
#include <stdio.h>
#include <string.h>
int main(void) {
  printf("%d\n", (int)strlen("你好"));
  return 0;
}
```

The output contains `6`.

### Room for the copy

`strcpy` writes into an array the caller provides. `buf` has 8 bytes, enough for `茶` and the terminating null.

```c run expect="茶" title="Copy"
#include <stdio.h>
#include <string.h>
int main(void) {
  char buf[8];
  strcpy(buf, "茶");
  printf("%s\n", buf);
  return 0;
}
```

The output contains `茶`.

### Compare two strings

`strcmp` compares the bytes of both arguments. The two copies of `茶` match, so the return value is 0.

```c run expect="0" title="Equal"
#include <stdio.h>
#include <string.h>
int main(void) {
  printf("%d\n", strcmp("茶", "茶"));
  return 0;
}
```

The output contains `0`.
