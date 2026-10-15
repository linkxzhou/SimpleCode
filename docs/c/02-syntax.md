---
language: c
chapter: 2
title: "C 基础语法"
level: beginner
minutes: 8
goals:
  - "用分号结束语句"
  - "用花括号包住一块"
  - "用 /* */ 写注释"
sources:
  - learn-c
updated: "2026-10-15"
---

语句以分号结束。花括号决定一块代码从哪到哪。

### 分号

两条打印各写一行。

```c run expect="甲" title="第一行"
#include <stdio.h>
int main(void) {
  printf("甲\n");
  printf("乙\n");
  return 0;
}
```

输出里能看到 `甲`。

### 块

块里可以声明只在块内使用的变量。

```c run expect="2" title="块内的 2"
#include <stdio.h>
int main(void) {
  int n = 1;
  {
    int m = 2;
    printf("%d\n", m);
  }
  printf("%d\n", n);
  return 0;
}
```

输出里能看到 `2`。

### 注释

注释里的打印不会执行。

```c run expect="留下" title="跳过注释"
#include <stdio.h>
int main(void) {
  /* printf("隐藏\n"); */
  printf("留下\n");
  return 0;
}
```

输出里能看到 `留下`。
