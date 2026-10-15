---
language: c
chapter: 23
title: "C 内存管理"
level: beginner
minutes: 8
goals:
  - "用 malloc 分配"
  - "用完 free"
  - "分配失败时不要使用空指针"
sources:
  - learn-c
updated: "2026-10-15"
---

`malloc` 的内存要 `free`。这次运行看得到写入的值，看不到泄漏本身，所以仍然要写上 `free`。

### 分配一个整数

写入后再读出来。

```c run expect="7" title="堆上的 7"
#include <stdio.h>
#include <stdlib.h>
int main(void) {
  int *p = malloc(sizeof *p);
  if (!p) return 1;
  *p = 7;
  printf("%d\n", *p);
  free(p);
  return 0;
}
```

输出里能看到 `7`。

### 分配数组

元素个数乘上每个元素的大小。

```c run expect="3" title="两项之和"
#include <stdio.h>
#include <stdlib.h>
int main(void) {
  int *p = malloc(sizeof *p * 2);
  if (!p) return 1;
  p[0] = 1;
  p[1] = 2;
  printf("%d\n", p[0] + p[1]);
  free(p);
  return 0;
}
```

输出里能看到 `3`。

### 空指针不要解引用

这里不调用 `malloc` 失败的路径，只演示先判断再使用。指针非空才打印。

```c run expect="4" title="先判断"
#include <stdio.h>
#include <stdlib.h>
int main(void) {
  int *p = malloc(sizeof *p);
  if (p) {
    *p = 4;
    printf("%d\n", *p);
    free(p);
  }
  return 0;
}
```

输出里能看到 `4`。
