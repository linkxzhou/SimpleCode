---
language: c
chapter: 20
title: "C Preprocessor"
level: beginner
minutes: 8
goals:
  - "Bring in declarations with include"
  - "Replace text with define"
  - "Choose lines with ifdef when a macro exists"
sources:
  - learn-c
updated: "2026-10-16"
---

The preprocessor runs before compilation. A macro substitutes text. It does not run as a function.

### include

`stdio.h` declares `printf`. The call in `main` is valid because that header was included.

```c run expect="有头文件" title="It compiles"
#include <stdio.h>
int main(void) {
  printf("有头文件\n");
  return 0;
}
```

The output contains `有头文件`.

### define

`ADD` pastes its arguments into `((a) + (b))`. The parentheses keep the addition grouped when the macro is expanded.

```c run expect="5" title="Add with a macro"
#include <stdio.h>
#define ADD(a, b) ((a) + (b))
int main(void) {
  printf("%d\n", ADD(2, 3));
  return 0;
}
```

The output contains `5`.

### Conditional compilation

`SHOW` is defined as 1, so `#if SHOW` keeps the `printf`. A zero in that directive would remove the call before compilation.

```c run expect="显示" title="Macro is true"
#include <stdio.h>
#define SHOW 1
int main(void) {
#if SHOW
  printf("显示\n");
#endif
  return 0;
}
```

The output contains `显示`.
