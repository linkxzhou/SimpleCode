---
language: c
chapter: 16
title: "C enum"
level: beginner
minutes: 8
goals:
  - "给一组整数起名字"
  - "从 0 开始递增"
  - "在 switch 里使用枚举"
sources:
  - learn-c
updated: "2026-10-15"
---

枚举是整数的名字。不指定数值时从 0 递增。

### 默认序号

第二个名字是 1。

```c run expect="1" title="星期二"
#include <stdio.h>
enum Day { MON, TUE };
int main(void) {
  printf("%d\n", TUE);
  return 0;
}
```

输出里能看到 `1`。

### 指定数值

可以给某一个名字写上数值。

```c run expect="200" title="指定 200"
#include <stdio.h>
enum Status { OK = 200 };
int main(void) {
  printf("%d\n", OK);
  return 0;
}
```

输出里能看到 `200`。

### 放进 switch

枚举值可以当 `switch` 的条件。

```c run expect="two" title="第二天"
#include <stdio.h>
enum Day { MON = 1, TUE = 2 };
int main(void) {
  enum Day d = TUE;
  switch (d) {
    case MON: printf("one\n"); break;
    case TUE: printf("two\n"); break;
  }
  return 0;
}
```

输出里能看到 `two`。
