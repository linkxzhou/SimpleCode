---
language: c
chapter: 10
title: "stdio 里够用的函数"
level: advanced
minutes: 18
goals:
  - "用 snprintf 先格式化再打印"
  - "用 fgets 读入一行"
  - "用 sscanf 从一行里取数"
sources:
  - beej-c
  - modern-c
  - learn-c
updated: "2026-10-15"
---

stdio 这一章只留在单文件里够用的几件：printf、snprintf、fgets、sscanf。不打开磁盘文件，因为示例不依赖下次还在的路径。

snprintf 把格式化结果写进你提供的缓冲区，并保证以空字符结尾（只要容量大于 0）。容量用 sizeof buf。然后再 printf 这个缓冲区，这样格式逻辑和输出分开。

fgets 读入一行，包含换行，除非这一行长过缓冲区。读到的文本再用 sscanf 取出数字。比直接 scanf 多一步，但你能看见整行。缓冲区要够放下示例输入。

```c run expect="42" title="先格式化"
#include <stdio.h>
int main(void) {
  char buf[32];
  snprintf(buf, sizeof buf, "%d", 6 * 7);
  printf("%s\n", buf);
  return 0;
}
```

```c run stdin="Ada\n" expect="Ada" title="读一行"
#include <stdio.h>
int main(void) {
  char buf[32];
  if (!fgets(buf, sizeof buf, stdin)) return 1;
  printf("%s", buf);
  return 0;
}
```

```c run stdin="41\n" expect="42" title="从一行取数"
#include <stdio.h>
int main(void) {
  char buf[32];
  int n = 0;
  if (!fgets(buf, sizeof buf, stdin)) return 1;
  if (sscanf(buf, "%d", &n) != 1) return 1;
  printf("%d\n", n + 1);
  return 0;
}
```

### 读「先格式化」

先做这一例。把代码收成一行来记：`#include <stdio.h> int main(void) { char buf[32]; snprintf(buf, sizeof buf, "%d", 6 * 7); printf("%s\n", buf); return 0; }`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「读一行」

做完上一例再做这一例。把代码收成一行来记：`#include <stdio.h> int main(void) { char buf[32]; if (!fgets(buf, sizeof buf, stdin)) return 1; printf("%s", buf); return 0; }`。先盖住终端，写下你预测的输出，里面要能找到「Ada」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「从一行取数」

做完上一例再做这一例。把代码收成一行来记：`#include <stdio.h> int main(void) { char buf[32]; int n = 0; if (!fgets(buf, sizeof buf, stdin)) return 1; if (sscanf(buf, "%d", &n) != 1) return 1; p…`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：先格式化

这一例要避开的失误是：snprintf 的容量写成一个拍脑袋的小数，结果被截断还当成功。。对应的做法是：缓冲区容量用 sizeof。。

把代码收成一行来核对：`#include <stdio.h> int main(void) { char buf[32]; snprintf(buf, sizeof buf, "%d", 6 * 7); printf("%s\n", buf); return 0; }`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

### 只改一处：读一行

这一例要避开的失误是：fgets 的缓冲区装不下一行，却只处理一次。。对应的做法是：fgets 和 sscanf 的失败都要判断。。

把代码收成一行来核对：`#include <stdio.h> int main(void) { char buf[32]; if (!fgets(buf, sizeof buf, stdin)) return 1; printf("%s", buf); return 0; }`。盖住终端，先写下预测，里面要能找到「Ada」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「Ada」才算失败。

### 只改一处：从一行取数

这一例要避开的失误是：打开一个磁盘路径，以为下次运行文件还在。。对应的做法是：教学示例不依赖外部文件。。

把代码收成一行来核对：`#include <stdio.h> int main(void) { char buf[32]; int n = 0; if (!fgets(buf, sizeof buf, stdin)) return 1; if (sscanf(buf, "%d", &n) != 1) return 1; p…`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

## 读完再动手

本章要留下的是 「用 snprintf 先格式化再打印」、「用 fgets 读入一行」、「用 sscanf 从一行里取数」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- snprintf 的容量写成一个拍脑袋的小数，结果被截断还当成功。
- fgets 的缓冲区装不下一行，却只处理一次。
- 打开一个磁盘路径，以为下次运行文件还在。

## 最佳实践

- 缓冲区容量用 sizeof。
- fgets 和 sscanf 的失败都要判断。
- 教学示例不依赖外部文件。

## 小结

snprintf 写入缓冲区，fgets 读一行，sscanf 从这行取数。容量和失败都要处理。不靠磁盘文件。

## 练习

用 snprintf 放入 7，再打印。

::: answer 参考答案：缓冲
```c run expect="7" title="参考答案"
#include <stdio.h>
int main(void) {
  char buf[16];
  snprintf(buf, sizeof buf, "%d", 7);
  printf("%s\n", buf);
  return 0;
}
```
:::

从一行读两个整数并打印和。输入是 20 22。

::: answer 参考答案：行里的和
```c run stdin="20 22\n" expect="42" title="参考答案"
#include <stdio.h>
int main(void) {
  char buf[32];
  int a = 0;
  int b = 0;
  if (!fgets(buf, sizeof buf, stdin)) return 1;
  if (sscanf(buf, "%d %d", &a, &b) != 2) return 1;
  printf("%d\n", a + b);
  return 0;
}
```
:::

## 延伸阅读

- [Beej's Guide to C Programming](https://beej.us/guide/bgc/)（仅链接）
- [Modern C](https://gustedt.gitlabpages.inria.fr/modern-c/)（仅链接）
- [learn-c.org](https://www.learn-c.org/)（仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 Beej's Guide to C、Modern C 与 learn-c.org，没有逐字搬用原文。
