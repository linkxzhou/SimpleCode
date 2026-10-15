---
language: c
chapter: 20
title: "C 预处理器"
level: beginner
minutes: 8
goals:
  - "用 include 引入声明"
  - "用 define 替换"
  - "用 ifdef 按宏是否存在选择"
sources:
  - learn-c
updated: "2026-10-15"
---

预处理发生在编译之前。宏是文本替换，不是函数调用。

### include

有了 `stdio.h`，才能调用 `printf`。

```c run expect="有头文件" title="能编译"
#include <stdio.h>
int main(void) {
  printf("有头文件\n");
  return 0;
}
```

输出里能看到 `有头文件`。

### define

宏的参数整体替换进去。外层括号避免优先级问题。

```c run expect="5" title="宏相加"
#include <stdio.h>
#define ADD(a, b) ((a) + (b))
int main(void) {
  printf("%d\n", ADD(2, 3));
  return 0;
}
```

输出里能看到 `5`。

### 条件编译

定义了 `SHOW` 才打印那一句。

```c run expect="显示" title="宏为真"
#include <stdio.h>
#define SHOW 1
int main(void) {
#if SHOW
  printf("显示\n");
#endif
  return 0;
}
```

输出里能看到 `显示`。
