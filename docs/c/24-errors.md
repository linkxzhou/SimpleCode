---
language: c
chapter: 24
title: "C 错误处理"
level: beginner
minutes: 8
goals:
  - "用返回值表示失败"
  - "调用方检查返回值"
  - "不把未检查的结果拿去用"
sources:
  - learn-c
updated: "2026-10-15"
---

C 没有用来报告业务失败的异常。函数返回一个状态，调用方决定下一步。

### 返回状态

数量不合法时返回 1。

```c run expect="1" title="失败"
#include <stdio.h>
int sell(int n) {
  if (n < 1) return 1;
  return 0;
}
int main(void) {
  printf("%d\n", sell(0));
  return 0;
}
```

输出里能看到 `1`。

### 成功返回零

合法数量返回 0。

```c run expect="0" title="成功"
#include <stdio.h>
int sell(int n) {
  if (n < 1) return 1;
  return 0;
}
int main(void) {
  printf("%d\n", sell(2));
  return 0;
}
```

输出里能看到 `0`。

### 检查之后再打印结果

只有状态为 0 时才使用那个数。

```c run expect="18" title="检查后使用"
#include <stdio.h>
int parse_ok(int *out) {
  *out = 18;
  return 0;
}
int main(void) {
  int n = 0;
  if (parse_ok(&n) == 0) printf("%d\n", n);
  return 0;
}
```

输出里能看到 `18`。
