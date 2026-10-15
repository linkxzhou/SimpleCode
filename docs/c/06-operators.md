---
language: c
chapter: 6
title: "C 运算符"
level: beginner
minutes: 8
goals:
  - "使用余数"
  - "使用比较"
  - "把自增写成独立语句"
sources:
  - learn-c
updated: "2026-10-15"
---

比较的结果是 0 或 1。`++` 在课程里单独成句。

### 余数

21 除以 10 的余数是 1。

```c run expect="1" title="余数"
#include <stdio.h>
int main(void) {
  printf("%d\n", 21 % 10);
  return 0;
}
```

输出里能看到 `1`。

### 比较

成立时打印 1。

```c run expect="1" title="大于"
#include <stdio.h>
int main(void) {
  printf("%d\n", 3 > 1);
  return 0;
}
```

输出里能看到 `1`。

### 自增

`n++` 让 n 变成原来的值加一。

```c run expect="22" title="加一"
#include <stdio.h>
int main(void) {
  int n = 21;
  n++;
  printf("%d\n", n);
  return 0;
}
```

输出里能看到 `22`。
