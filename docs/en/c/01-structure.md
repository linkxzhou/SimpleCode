---
language: c
chapter: 1
title: "C Program Structure"
level: beginner
minutes: 8
goals:
  - "Include the headers you need"
  - "Enter through main"
  - "Write a helper in the same file"
sources:
  - learn-c
updated: "2026-10-16"
---

A program that runs must define `main`. Include the matching header before you call a standard function.

### The entry point

An interpreted script can start without `main`. A C program always begins at `main`.

```c run expect="进入" title="Entry"
#include <stdio.h>
int main(void) {
  printf("进入\n");
  return 0;
}
```

The output contains `进入`.

### A helper function

`add` may be written above `main` in the same file. It returns `2 + 3`, and `printf` writes that `int`.

```c run expect="5" title="Add"
#include <stdio.h>
int add(int a, int b) { return a + b; }
int main(void) {
  printf("%d\n", add(2, 3));
  return 0;
}
```

The output contains `5`.

### Match the header to the call

The only call is `printf`, so the only header is `stdio.h`. Another include would suggest that other library functions appear in the file.

```c run expect="7" title="printf only"
#include <stdio.h>
int main(void) {
  printf("%d\n", 7);
  return 0;
}
```

The output contains `7`.
