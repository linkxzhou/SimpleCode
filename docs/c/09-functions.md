---
language: c
chapter: 9
title: "C 函数"
level: beginner
minutes: 8
goals:
  - "声明参数和返回类型"
  - "用返回值表示结果"
  - "把数组长度单独传进去"
sources:
  - learn-c
updated: "2026-10-15"
---

C 的函数要写出每个参数的类型。数组作为参数时，长度不会一起传过去。

### 返回和

调用处用返回值。

```c run expect="5" title="相加"
#include <stdio.h>
int add(int a, int b) { return a + b; }
int main(void) {
  printf("%d\n", add(2, 3));
  return 0;
}
```

输出里能看到 `5`。

### 没有返回值

`void` 函数自己打印。

```c run expect="好" title="无返回值"
#include <stdio.h>
void show(void) { printf("好\n"); }
int main(void) {
  show();
  return 0;
}
```

输出里能看到 `好`。

### 数组要另传长度

函数只看见指针，长度由调用方传入。

```c run expect="6" title="三项之和"
#include <stdio.h>
int sum(const int *a, int n) {
  int i, total = 0;
  for (i = 0; i < n; i++) total += a[i];
  return total;
}
int main(void) {
  int a[3] = {1, 2, 3};
  printf("%d\n", sum(a, 3));
  return 0;
}
```

输出里能看到 `6`。
