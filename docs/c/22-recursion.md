---
language: c
chapter: 22
title: "C 递归"
level: beginner
minutes: 8
goals:
  - "写出会调用自己的函数"
  - "放上基准情形"
  - "只用很小的深度"
sources:
  - learn-c
updated: "2026-10-15"
---

递归函数必须有一个不再调用自己的分支。课程里的参数只用个位数。

### 阶乘

4 的阶乘是 24。

```c run expect="24" title="四的阶乘"
#include <stdio.h>
int fact(int n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
}
int main(void) {
  printf("%d\n", fact(4));
  return 0;
}
```

输出里能看到 `24`。

### 基准

1 的阶乘是 1，不再往下调用。

```c run expect="1" title="停住"
#include <stdio.h>
int fact(int n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
}
int main(void) {
  printf("%d\n", fact(1));
  return 0;
}
```

输出里能看到 `1`。

### 累加

从 n 加到 1。

```c run expect="10" title="一加到四"
#include <stdio.h>
int sum_to(int n) {
  if (n <= 1) return n;
  return n + sum_to(n - 1);
}
int main(void) {
  printf("%d\n", sum_to(4));
  return 0;
}
```

输出里能看到 `10`。
