---
language: c
chapter: 4
title: "C 变量"
level: beginner
minutes: 8
goals:
  - "先声明再使用"
  - "给局部变量赋初值"
  - "知道未初始化的值不能拿来打印"
sources:
  - learn-c
updated: "2026-10-15"
---

局部变量要先赋值再读。课程里的每个变量都在使用前写上初值。

### 声明并赋值

类型写在名字前面。

```c run expect="18" title="单价"
#include <stdio.h>
int main(void) {
  int price = 18;
  printf("%d\n", price);
  return 0;
}
```

输出里能看到 `18`。

### 可以再改

同一名字可以赋一个新的数。

```c run expect="4" title="改成 4"
#include <stdio.h>
int main(void) {
  int n = 1;
  n = 4;
  printf("%d\n", n);
  return 0;
}
```

输出里能看到 `4`。

### 字符用单引号

单引号是一个字符，双引号是字符串。

```c run expect="A" title="一个字符"
#include <stdio.h>
int main(void) {
  char c = 'A';
  printf("%c\n", c);
  return 0;
}
```

输出里能看到 `A`。
