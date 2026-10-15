---
language: c
chapter: 10
title: "C 作用域规则"
level: beginner
minutes: 8
goals:
  - "区分函数内的局部变量"
  - "看出块内的同名变量挡住外面"
  - "知道参数也是局部变量"
sources:
  - learn-c
updated: "2026-10-15"
---

名字从声明处开始，到所在块结束。内层可以再声明同名变量。

### 参数

参数只在函数里。

```c run expect="8" title="参数"
#include <stdio.h>
int twice(int n) { return n * 2; }
int main(void) {
  printf("%d\n", twice(4));
  return 0;
}
```

输出里能看到 `8`。

### 块内遮蔽

内层的 `n` 是 2。块结束后，外层的 `n` 仍是 1。

```c run expect="2" title="先是内层"
#include <stdio.h>
int main(void) {
  int n = 1;
  {
    int n = 2;
    printf("%d\n", n);
  }
  printf("%d\n", n);
  return 0;
}
```

输出里能看到 `2`。

### 出了块用外层

块结束后，外层的值还在。

```c run expect="3" title="外层被加上"
#include <stdio.h>
int main(void) {
  int n = 1;
  {
    int m = 2;
    n = n + m;
  }
  printf("%d\n", n);
  return 0;
}
```

输出里能看到 `3`。
