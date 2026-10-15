---
language: c
chapter: 13
title: "C 指针"
level: beginner
minutes: 8
goals:
  - "用 & 取地址"
  - "用 * 读所指的值"
  - "通过指针改原来的变量"
sources:
  - learn-c
updated: "2026-10-15"
---

指针保存地址。解引用之前，它必须指向一个真实的变量。

### 读取

`*` 得到指针指向的值。

```c run expect="9" title="指向 9"
#include <stdio.h>
int main(void) {
  int n = 9;
  int *p = &n;
  printf("%d\n", *p);
  return 0;
}
```

输出里能看到 `9`。

### 改原来的变量

通过指针赋值，`n` 自己会变。

```c run expect="8" title="改成 8"
#include <stdio.h>
int main(void) {
  int n = 3;
  int *p = &n;
  *p = 8;
  printf("%d\n", n);
  return 0;
}
```

输出里能看到 `8`。

### 函数里改调用方

要改调用方的变量，就传指针。

```c run expect="11" title="加一"
#include <stdio.h>
void inc(int *p) { *p = *p + 1; }
int main(void) {
  int n = 10;
  inc(&n);
  printf("%d\n", n);
  return 0;
}
```

输出里能看到 `11`。
