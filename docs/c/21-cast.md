---
language: c
chapter: 21
title: "C 强制类型转换"
level: beginner
minutes: 8
goals:
  - "把小数截成整数"
  - "把整数提升为小数再除"
  - "知道转换不会四舍五入"
sources:
  - learn-c
updated: "2026-10-15"
---

类型转换要写出来。把 `double` 收成 `int` 会丢掉小数。

### 丢掉小数

`(int)3.9` 得到 3。

```c run expect="3" title="截断"
#include <stdio.h>
int main(void) {
  double f = 3.9;
  printf("%d\n", (int)f);
  return 0;
}
```

输出里能看到 `3`。

### 先变成小数再除

先把一个整数转成 `double`，除法才保留小数。

```c run expect="3.5" title="保留小数"
#include <stdio.h>
int main(void) {
  int a = 7;
  printf("%.1f\n", (double)a / 2);
  return 0;
}
```

输出里能看到 `3.5`。

### 字符的编码

字符 `'A'` 转成 `int` 是它的编码。ASCII 里是 65。

```c run expect="65" title="编码"
#include <stdio.h>
int main(void) {
  printf("%d\n", (int)'A');
  return 0;
}
```

输出里能看到 `65`。
