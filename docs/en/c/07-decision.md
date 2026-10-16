---
language: c
chapter: 7
title: "C Decision"
level: beginner
minutes: 8
goals:
  - "Branch with if and else"
  - "Chain further tests with else if"
  - "List discrete values with switch"
sources:
  - learn-c
updated: "2026-10-16"
---

The condition must sit inside parentheses. Any non-zero value counts as true, and zero counts as false.

### if and else

`n` is 4, so `n > 0` succeeds. The first `printf` writes its label, and the `else` call is not reached.

```c run expect="正数" title="Positive branch"
#include <stdio.h>
int main(void) {
  int n = 4;
  if (n > 0) printf("正数\n");
  else printf("非正\n");
  return 0;
}
```

The output contains `正数`.

### else if

`score` is 70, so `score >= 90` fails. The following `else if` succeeds because 70 is at least 60, and that arm prints.

```c run expect="中" title="Score band"
#include <stdio.h>
int main(void) {
  int score = 70;
  if (score >= 90) printf("高\n");
  else if (score >= 60) printf("中\n");
  else printf("低\n");
  return 0;
}
```

The output contains `中`.

### switch

`day` is 3, so `case 3` runs. `break` then leaves the `switch` instead of falling into `default`.

```c run expect="三" title="Third day"
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

The output contains `三`.
