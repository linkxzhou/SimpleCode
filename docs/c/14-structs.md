---
language: c
chapter: 14
title: "C 结构体"
level: beginner
minutes: 8
goals:
  - "把字段放进 struct"
  - "用点号读取"
  - "通过指针用箭头读取"
sources:
  - learn-c
updated: "2026-10-15"
---

结构体把若干字段收成一个类型。

### 点号

变量后面用 `.` 读字段。

```c run expect="18" title="单价"
#include <stdio.h>
struct Item { int price; };
int main(void) {
  struct Item it;
  it.price = 18;
  printf("%d\n", it.price);
  return 0;
}
```

输出里能看到 `18`。

### 初始化

按字段顺序给出初值。

```c run expect="18" title="初值"
#include <stdio.h>
struct Item { int price; };
int main(void) {
  struct Item it = {18};
  printf("%d\n", it.price);
  return 0;
}
```

输出里能看到 `18`。

### 箭头

指针指向结构体时，用 `->`。

```c run expect="18" title="经指针"
#include <stdio.h>
struct Item { int price; };
int main(void) {
  struct Item it = {18};
  struct Item *p = &it;
  printf("%d\n", p->price);
  return 0;
}
```

输出里能看到 `18`。
