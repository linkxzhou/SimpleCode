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

```c run expect="plus" title="Positive branch"
#include <stdio.h>
int main(void) {
  int n = 4;
  if (n > 0) printf("plus\n");
  else printf("badnum\n");
  return 0;
}
```

The output contains `plus`.

### else if

`score` is 70, so `score >= 90` fails. The following `else if` succeeds because 70 is at least 60, and that arm prints.

```c run expect="mid" title="Score band"
#include <stdio.h>
int main(void) {
  int score = 70;
  if (score >= 90) printf("high\n");
  else if (score >= 60) printf("mid\n");
  else printf("low\n");
  return 0;
}
```

The output contains `mid`.

### switch

`day` is 3, so `case 3` runs. `break` then leaves the `switch` instead of falling into `default`.

```c run expect="three" title="Third day"
#include <stdio.h>
int main(void) {
  int day = 3;
  switch (day) {
    case 1: printf("one\n"); break;
    case 3: printf("three\n"); break;
    default: printf("other\n"); break;
  }
  return 0;
}
```

The output contains `three`.
