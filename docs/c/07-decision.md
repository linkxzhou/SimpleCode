---
language: c
chapter: 7
title: "C 判断"
level: beginner
minutes: 8
goals:
  - "用 if 和 else 分支"
  - "用 else if 接更多条件"
  - "用 switch 列出离散取值"
sources:
  - learn-c
updated: "2026-10-15"
---

条件外面的括号是必须的。非零为真，零为假。

### if else

只走一个分支。

```c run expect="正数" title="正数分支"
#include <stdio.h>
int main(void) {
  int n = 4;
  if (n > 0) printf("正数\n");
  else printf("非正\n");
  return 0;
}
```

输出里能看到 `正数`。

### else if

从上往下试。

```c run expect="中" title="分数档"
#include <stdio.h>
int main(void) {
  int score = 70;
  if (score >= 90) printf("高\n");
  else if (score >= 60) printf("中\n");
  else printf("低\n");
  return 0;
}
```

输出里能看到 `中`。

### switch

命中后用 `break` 离开，否则会掉进下一支。

```c run expect="三" title="第三天"
#include <stdio.h>
int main(void) {
  int day = 3;
  switch (day) {
    case 1: printf("一\n"); break;
    case 3: printf("三\n"); break;
    default: printf("其他\n"); break;
  }
  return 0;
}
```

输出里能看到 `三`。
