---
language: c
chapter: 8
title: "C 循环"
level: beginner
minutes: 8
goals:
  - "用 for 累加"
  - "用 while 减到零"
  - "用 break 离开循环"
sources:
  - learn-c
updated: "2026-10-15"
---

C 有 `for`、`while` 和 `do while`。条件变假就停。

### for

从 1 加到 3，和是 6。

```c run expect="6" title="加到 3"
#include <stdio.h>
int main(void) {
  int sum = 0;
  int i;
  for (i = 1; i <= 3; i++) sum += i;
  printf("%d\n", sum);
  return 0;
}
```

输出里能看到 `6`。

### while

块里要改变条件，否则停不下来。

```c run expect="0" title="减到零"
#include <stdio.h>
int main(void) {
  int left = 2;
  while (left > 0) left--;
  printf("%d\n", left);
  return 0;
}
```

输出里能看到 `0`。

### break

数到 3 就离开。

```c run expect="3" title="停在 3"
#include <stdio.h>
int main(void) {
  int n = 0;
  while (1) {
    n++;
    if (n == 3) break;
  }
  printf("%d\n", n);
  return 0;
}
```

输出里能看到 `3`。
