---
language: c
chapter: 11
title: "C 数组"
level: beginner
minutes: 8
goals:
  - "用下标读写"
  - "用 sizeof 计算元素个数"
  - "知道数组作为参数会退化"
sources:
  - learn-c
updated: "2026-10-15"
---

数组长度写在声明里。下标从 0 开始。

### 下标

第二项的下标是 1。

```c run expect="9" title="第二项"
#include <stdio.h>
int main(void) {
  int a[3] = {8, 9, 10};
  printf("%d\n", a[1]);
  return 0;
}
```

输出里能看到 `9`。

### 元素个数

整个数组的字节数除以一个元素的字节数。

```c run expect="3" title="三项"
#include <stdio.h>
int main(void) {
  int a[3] = {1, 2, 3};
  int n = (int)(sizeof a / sizeof a[0]);
  printf("%d\n", n);
  return 0;
}
```

输出里能看到 `3`。

### 改一项

下标赋值会改原来的数组。

```c run expect="1" title="改第一项"
#include <stdio.h>
int main(void) {
  int a[2] = {4, 5};
  a[0] = 1;
  printf("%d\n", a[0]);
  return 0;
}
```

输出里能看到 `1`。
