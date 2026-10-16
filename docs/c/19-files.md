---
language: c
chapter: 19
title: "C 文件读写"
level: beginner
minutes: 8
goals:
  - "知道本页不依赖宿主机路径"
  - "用 sprintf 准备一行文本"
  - "用 sscanf 从这行里读回数字"
sources:
  - learn-c
updated: "2026-10-15"
---

本机可以用 `fopen` 打开路径。这个编译结果没有你的磁盘可依赖，可运行例子只处理内存里的一行。

### fopen 留在阅读里

真实路径这里没有保证。

```c norun title="不写磁盘"
#include <stdio.h>
int main(void) {
  FILE *fp = fopen("note.txt", "w");
  if (fp) fclose(fp);
  return 0;
}
```

### 写进缓冲区

`sprintf` 把格式化结果放进数组。

```c run expect="tea 18" title="一行文本"
#include <stdio.h>
int main(void) {
  char buf[32];
  sprintf(buf, "tea %d", 18);
  printf("%s\n", buf);
  return 0;
}
```

输出里能看到 `tea 18`。

### 再读出来

`sscanf` 从这块内存里按格式读。

```c run expect="18" title="读回"
#include <stdio.h>
int main(void) {
  int n = 0;
  sscanf("18", "%d", &n);
  printf("%d\n", n);
  return 0;
}
```

输出里能看到 `18`。
