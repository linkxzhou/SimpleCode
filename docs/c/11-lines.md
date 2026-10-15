---
language: c
chapter: 11
title: "行计数小项目"
level: advanced
minutes: 18
goals:
  - "数标准输入里的行"
  - "跳过空行"
  - "把规则写成函数"
sources:
  - beej-c
  - modern-c
  - learn-c
updated: "2026-10-15"
---

小项目读标准输入，数出非空的行。范围限制在一次运行。没有网络，也不写文件。输入结束时 fgets 返回 NULL，循环停下。

空行在去掉末尾换行后长度为 0。只含换行的行不算。函数接收一行，返回它算不算。main 只负责读和累加，最后 printf 一个数。

示例的标准输入在文档里写好。你改计数规则时，只改函数，再看打印的数。不要在循环里留下没用的变量。

```c run expect="2" title="所有换行"
#include <stdio.h>
int main(void) {
  int n = 0;
  for (const char *p = "a\nb\n"; *p; p++) if (*p == '\n') n++;
  printf("%d\n", n);
  return 0;
}
```

```c run stdin="Ada\n\nGrace\n" expect="2" title="跳过空行"
#include <stdio.h>
#include <string.h>
int counted(char *line) {
  size_t n = strlen(line);
  if (n && line[n - 1] == '\n') line[n - 1] = '\0';
  return line[0] != '\0';
}
int main(void) {
  char buf[64];
  int n = 0;
  while (fgets(buf, sizeof buf, stdin)) if (counted(buf)) n++;
  printf("%d\n", n);
  return 0;
}
```

```c run expect="3" title="函数相加"
#include <stdio.h>
int add(int a, int b) { return a + b; }
int main(void) {
  printf("%d\n", add(1, 2));
  return 0;
}
```

### 读「所有换行」

先做这一例。把代码收成一行来记：`#include <stdio.h> int main(void) { int n = 0; for (const char *p = "a\nb\n"; *p; p++) if (*p == '\n') n++; printf("%d\n", n); return 0; }`。先盖住终端，写下你预测的输出，里面要能找到「2」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「跳过空行」

做完上一例再做这一例。把代码收成一行来记：`#include <stdio.h> #include <string.h> int counted(char *line) { size_t n = strlen(line); if (n && line[n - 1] == '\n') line[n - 1] = '\0'; return lin…`。先盖住终端，写下你预测的输出，里面要能找到「2」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「函数相加」

做完上一例再做这一例。把代码收成一行来记：`#include <stdio.h> int add(int a, int b) { return a + b; } int main(void) { printf("%d\n", add(1, 2)); return 0; }`。先盖住终端，写下你预测的输出，里面要能找到「3」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：所有换行

这一例要避开的失误是：把只含换行的行算成有内容。。对应的做法是：空行判断放进函数，循环只累加。。

把代码收成一行来核对：`#include <stdio.h> int main(void) { int n = 0; for (const char *p = "a\nb\n"; *p; p++) if (*p == '\n') n++; printf("%d\n", n); return 0; }`。盖住终端，先写下预测，里面要能找到「2」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「2」才算失败。

### 只改一处：跳过空行

这一例要避开的失误是：fgets 失败和读到空行混成同一种处理。。对应的做法是：去掉换行再看第一个字符。。

把代码收成一行来核对：`#include <stdio.h> #include <string.h> int counted(char *line) { size_t n = strlen(line); if (n && line[n - 1] == '\n') line[n - 1] = '\0'; return lin…`。盖住终端，先写下预测，里面要能找到「2」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「2」才算失败。

### 只改一处：函数相加

这一例要避开的失误是：在计数函数里直接读 stdin，测试必须绑死在循环上。。对应的做法是：只打印最终的个数。。

把代码收成一行来核对：`#include <stdio.h> int add(int a, int b) { return a + b; } int main(void) { printf("%d\n", add(1, 2)); return 0; }`。盖住终端，先写下预测，里面要能找到「3」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「3」才算失败。

## 读完再动手

本章要留下的是 「数标准输入里的行」、「跳过空行」、「把规则写成函数」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 把只含换行的行算成有内容。
- fgets 失败和读到空行混成同一种处理。
- 在计数函数里直接读 stdin，测试必须绑死在循环上。

## 最佳实践

- 空行判断放进函数，循环只累加。
- 去掉换行再看第一个字符。
- 只打印最终的个数。

## 小结

行计数是一次运行里的 fgets 循环。空行不算。规则放在函数里，main 只打印个数。

## 练习

数字符串里的换行。文本是 a、b、c 各占一行。

::: answer 参考答案：三行
```c run expect="3" title="参考答案"
#include <stdio.h>
int main(void) {
  int n = 0;
  for (const char *p = "a\nb\nc\n"; *p; p++) if (*p == '\n') n++;
  printf("%d\n", n);
  return 0;
}
```
:::

从输入数非空行。输入是 x、空行、y。

::: answer 参考答案：非空
```c run stdin="x\n\ny\n" expect="2" title="参考答案"
#include <stdio.h>
#include <string.h>
int counted(char *line) {
  size_t n = strlen(line);
  if (n && line[n - 1] == '\n') line[n - 1] = '\0';
  return line[0] != '\0';
}
int main(void) {
  char buf[64];
  int n = 0;
  while (fgets(buf, sizeof buf, stdin)) if (counted(buf)) n++;
  printf("%d\n", n);
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
