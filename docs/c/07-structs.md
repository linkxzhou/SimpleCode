---
language: c
chapter: 7
title: "结构体"
level: intermediate
minutes: 18
goals:
  - "把相关的数据放进 struct"
  - "用 . 和 -> 访问字段"
  - "按值传递和按指针传递"
sources:
  - beej-c
  - modern-c
  - learn-c
updated: "2026-10-15"
---

struct 把几个字段放在一个名字下。字段用 . 访问。若你手里是指向结构体的指针，用 ->。

按值传给函数时，函数拿到的是副本，改副本不影响调用者。要改调用者的结构体，传指针。读取一个小结构体时，按值传递更直接，本教程的宽度只有一个 int。

结构体本身没有「方法」。操作写成接收结构体或指针的函数，放在结构体定义下面。初始化时把每个字段都写上，避免读到没有赋值的字段。

```c run expect="10" title="两倍宽"
#include <stdio.h>
struct Line { int width; };
int span(struct Line line) { return line.width * 2; }
int main(void) {
  struct Line line = {5};
  printf("%d\n", span(line));
  return 0;
}
```

```c run expect="42" title="改字段"
#include <stdio.h>
struct Line { int width; };
void widen(struct Line *line) { line->width += 1; }
int main(void) {
  struct Line line = {41};
  widen(&line);
  printf("%d\n", line.width);
  return 0;
}
```

```c run expect="42" title="两个字段"
#include <stdio.h>
struct Pair { int a; int b; };
int main(void) {
  struct Pair p = {19, 23};
  printf("%d\n", p.a + p.b);
  return 0;
}
```

### 读「两倍宽」

先做这一例。把代码收成一行来记：`#include <stdio.h> struct Line { int width; }; int span(struct Line line) { return line.width * 2; } int main(void) { struct Line line = {5}; printf("…`。先盖住终端，写下你预测的输出，里面要能找到「10」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「改字段」

做完上一例再做这一例。把代码收成一行来记：`#include <stdio.h> struct Line { int width; }; void widen(struct Line *line) { line->width += 1; } int main(void) { struct Line line = {41}; widen(&li…`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「两个字段」

做完上一例再做这一例。把代码收成一行来记：`#include <stdio.h> struct Pair { int a; int b; }; int main(void) { struct Pair p = {19, 23}; printf("%d\n", p.a + p.b); return 0; }`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：两倍宽

这一例要避开的失误是：对指针使用 . ，或对对象使用 ->。。对应的做法是：初始化时列出要用的字段。。

把代码收成一行来核对：`#include <stdio.h> struct Line { int width; }; int span(struct Line line) { return line.width * 2; } int main(void) { struct Line line = {5}; printf("…`。盖住终端，先写下预测，里面要能找到「10」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「10」才算失败。

### 只改一处：改字段

这一例要避开的失误是：按值传入后修改，以为调用者会看见。。对应的做法是：只读用按值或 const 指针，要改用指针。。

把代码收成一行来核对：`#include <stdio.h> struct Line { int width; }; void widen(struct Line *line) { line->width += 1; } int main(void) { struct Line line = {41}; widen(&li…`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

### 只改一处：两个字段

这一例要避开的失误是：字段没有初始化就打印。。对应的做法是：函数名写出它做的事，结构体名写出它是什么。。

把代码收成一行来核对：`#include <stdio.h> struct Pair { int a; int b; }; int main(void) { struct Pair p = {19, 23}; printf("%d\n", p.a + p.b); return 0; }`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

## 读完再动手

本章要留下的是 「把相关的数据放进 struct」、「用 . 和 -> 访问字段」、「按值传递和按指针传递」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 对指针使用 . ，或对对象使用 ->。
- 按值传入后修改，以为调用者会看见。
- 字段没有初始化就打印。

## 最佳实践

- 初始化时列出要用的字段。
- 只读用按值或 const 指针，要改用指针。
- 函数名写出它做的事，结构体名写出它是什么。

## 小结

结构体用字段聚合数据。. 用于对象，-> 用于指针。按值传递不会改到调用者。

## 练习

定义有一个 int 字段 n 的结构体，打印 41 加 1。

::: answer 参考答案：和
```c run expect="42" title="参考答案"
#include <stdio.h>
struct Num { int n; };
int main(void) {
  struct Num num = {41};
  printf("%d\n", num.n + 1);
  return 0;
}
```
:::

结构体里放一个字符串指针，打印 Ada 的字节数。

::: answer 参考答案：名字长度
```c run expect="3" title="参考答案"
#include <stdio.h>
#include <string.h>
struct Unit { const char *name; };
int main(void) {
  struct Unit u = {"Ada"};
  printf("%d\n", (int)strlen(u.name));
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
