---
language: c
chapter: 0
title: "C 语言教程"
minutes: 8
goals:
  - "写出返回 int 的 main"
  - "用 printf 把结果送出来"
  - "知道警告会让这次编译失败"
sources:
  - learn-c
updated: "2026-10-15"
---

这一本由 clang 编译成 WebAssembly 再运行。`main` 返回 `int`。没用到的变量不要留着。

### 第一行

`printf` 不会自动换行，格式串里自己写 `\n`。

```c run expect="你好" title="打招呼"
#include <stdio.h>
int main(void) {
  printf("你好\n");
  return 0;
}
```

输出里能看到 `你好`。

### 返回零

返回 0 表示这次程序正常结束。

```c run expect="0" title="正常结束"
#include <stdio.h>
int main(void) {
  printf("%d\n", 0);
  return 0;
}
```

输出里能看到 `0`。

### 安装命令不是源码

`gcc` 那一行是终端命令，放进 `.c` 文件不会去编译别的文件。

```c norun title="不是 C 语句"
gcc main.c
```
