---
language: c
chapter: 3
title: "C 数据类型"
level: beginner
minutes: 8
goals:
  - "区分 int、double 和 char"
  - "知道整数相除丢掉小数"
  - "用 sizeof 看占用的字节"
sources:
  - learn-c
updated: "2026-10-15"
---

类型在声明时写死。整数和小数的除法不一样。

### 整除

两个 `int` 相除，结果仍是 `int`。

```c run expect="3" title="商"
#include <stdio.h>
int main(void) {
  printf("%d\n", 20 / 6);
  return 0;
}
```

输出里能看到 `3`。

### 小数

至少一个运算数是 `double` 时，结果带小数。

```c run expect="3.5" title="浮点除法"
#include <stdio.h>
int main(void) {
  printf("%.1f\n", 7.0 / 2.0);
  return 0;
}
```

输出里能看到 `3.5`。

### sizeof

`int` 至少占若干字节。这里只打印 `char` 的大小，它是 1。

```c run expect="1" title="一个字节"
#include <stdio.h>
int main(void) {
  printf("%d\n", (int)sizeof(char));
  return 0;
}
```

输出里能看到 `1`。
