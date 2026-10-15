---
language: c
chapter: 1
title: "C 程序结构"
level: beginner
minutes: 8
goals:
  - "包含需要的头文件"
  - "从 main 进入"
  - "在同一个文件里写辅助函数"
sources:
  - learn-c
updated: "2026-10-15"
---

一份可运行的程序至少要有 `main`。用到的标准函数要先包含对应的头。

### 入口

解释器式的语言可以没有 `main`。C 必须有。

```c run expect="进入" title="入口"
#include <stdio.h>
int main(void) {
  printf("进入\n");
  return 0;
}
```

输出里能看到 `进入`。

### 辅助函数

函数可以写在 `main` 上面。

```c run expect="5" title="相加"
#include <stdio.h>
int add(int a, int b) { return a + b; }
int main(void) {
  printf("%d\n", add(2, 3));
  return 0;
}
```

输出里能看到 `5`。

### 头文件要和调用对应

只用 `stdio.h` 时不要再包含用不到的头，避免读者以为那些函数已经出现。

```c run expect="7" title="只用 printf"
#include <stdio.h>
int main(void) {
  printf("%d\n", 7);
  return 0;
}
```

输出里能看到 `7`。
