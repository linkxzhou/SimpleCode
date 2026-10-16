---
language: c
chapter: 12
title: "C 字符串"
level: beginner
minutes: 8
goals:
  - "知道字符串以空字符结尾"
  - "用 strlen 得到字节数"
  - "用 strcmp 比较"
sources:
  - learn-c
updated: "2026-10-15"
---

C 的字符串是以 `\0` 结尾的字符数组。`strlen` 数的是字节。

### 字节长度

`Hello!` 有 6 个字节。

```c run expect="6" title="六个字节"
#include <stdio.h>
#include <string.h>
int main(void) {
  printf("%d\n", (int)strlen("Hello!"));
  return 0;
}
```

输出里能看到 `6`。

### 复制要有足够空间

`strcpy` 写进调用方准备的数组。

```c run expect="tea" title="复制"
#include <stdio.h>
#include <string.h>
int main(void) {
  char buf[8];
  strcpy(buf, "tea");
  printf("%s\n", buf);
  return 0;
}
```

输出里能看到 `tea`。

### 比较

相同的文本，`strcmp` 返回 0。

```c run expect="0" title="相等"
#include <stdio.h>
#include <string.h>
int main(void) {
  printf("%d\n", strcmp("tea", "tea"));
  return 0;
}
```

输出里能看到 `0`。
