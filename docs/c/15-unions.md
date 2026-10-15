---
language: c
chapter: 15
title: "C 共用体"
level: beginner
minutes: 8
goals:
  - "知道成员共用一块内存"
  - "写入一个成员再读同一个成员"
  - "不要依赖另一种读法的字节解释"
sources:
  - learn-c
updated: "2026-10-15"
---

共用体的成员叠在同一块内存上。最后写入的那个成员才是有意义的读法。

### 写入再读

写入 `int` 成员，再读 `int` 成员。

```c run expect="4" title="整数成员"
#include <stdio.h>
union Num { int i; double d; };
int main(void) {
  union Num u;
  u.i = 4;
  printf("%d\n", u.i);
  return 0;
}
```

输出里能看到 `4`。

### 大小至少能放下最大的成员

`sizeof` 不小于 `int` 的大小。这里只确认它不是 0。

```c run expect="1" title="占有空间"
#include <stdio.h>
union Num { int i; double d; };
int main(void) {
  printf("%d\n", (int)(sizeof(union Num) > 0));
  return 0;
}
```

输出里能看到 `1`。

### 换成员写入

改写 `i` 之后，再读 `i` 得到新值。

```c run expect="7" title="后写的值"
#include <stdio.h>
union Num { int i; double d; };
int main(void) {
  union Num u;
  u.i = 1;
  u.i = 7;
  printf("%d\n", u.i);
  return 0;
}
```

输出里能看到 `7`。
