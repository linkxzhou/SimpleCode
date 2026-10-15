---
language: c
chapter: 5
title: "C 常量"
level: beginner
minutes: 8
goals:
  - "用 const 声明不打算改的变量"
  - "用 #define 给字面量起名"
  - "用枚举表示一组序号"
sources:
  - learn-c
updated: "2026-10-15"
---

常量让读者知道这个数不该在后面被改掉。

### const

`const int` 可以读取，课程里不再给它赋值。

```c run expect="100" title="沸点"
#include <stdio.h>
int main(void) {
  const int boiling = 100;
  printf("%d\n", boiling);
  return 0;
}
```

输出里能看到 `100`。

### 宏

`#define` 在编译前替换文本。

```c run expect="6" title="加倍"
#include <stdio.h>
#define DOUBLE(x) ((x) * 2)
int main(void) {
  printf("%d\n", DOUBLE(3));
  return 0;
}
```

输出里能看到 `6`。

### 枚举从零开始

不写值时，第一个是 0，后面逐个加一。

```c run expect="2" title="蓝色的序号"
#include <stdio.h>
enum Color { RED, GREEN, BLUE };
int main(void) {
  printf("%d\n", BLUE);
  return 0;
}
```

输出里能看到 `2`。
