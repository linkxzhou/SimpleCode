---
language: c
chapter: 0
title: "C Tutorial"
minutes: 8
goals:
  - "Write a main that returns int"
  - "Print a result with printf"
  - "Treat a warning as a failed compile"
sources:
  - learn-c
updated: "2026-10-16"
---

clang compiles each program in this book to WebAssembly, and the page runs that build. `main` returns an `int`. Do not leave an unused variable in the file, because a warning fails this compile.

### The first line

`printf` does not append a newline by itself. Put `\n` in the format string when the next output should start on a new line.

```c run expect="Hi" title="Say hello"
#include <stdio.h>
int main(void) {
  printf("Hi\n");
  return 0;
}
```

The output contains `Hi`.

### Return zero

A return value of 0 from `main` means the program finished normally. This sample prints that status with `%d` before returning it.

```c run expect="0" title="Normal exit"
#include <stdio.h>
int main(void) {
  printf("%d\n", 0);
  return 0;
}
```

The output contains `0`.

### An install command is not source

The `gcc` line is a shell command. Pasting it into a `.c` file does not ask the compiler to build another source file.

```c norun title="Not a C statement"
gcc main.c
```

That line belongs in the terminal. The page does not compile it as C.

### After chapter 25

Bitwise operations, two-dimensional arrays, function pointers, linked lists, stacks and queues, variadic arguments, `qsort`, undefined behavior, a few C11 forms, and a calculator limited to add, subtract, and multiply follow the error-handling chapter. The compiler is still this clang, and a warning still fails the build.
