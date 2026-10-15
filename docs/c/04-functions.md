---
language: c
chapter: 4
title: "函数"
level: intermediate
minutes: 18
goals:
  - "把计算写成函数"
  - "用参数传入、用返回值传出"
  - "在调用之前看见声明"
sources:
  - beej-c
  - modern-c
  - learn-c
updated: "2026-10-15"
---

函数把一段计算命名。参数是输入，返回值是输出。调用处要能看见函数的声明或定义，所以本教程把被调用的函数写在 main 上面。

C 按值传递。函数里给参数赋值，不会改调用者的变量。要改调用者的对象，传指针，那是后面一章的事。这一章的函数只返回一个 int。

函数如果写了却没人调用，可能被当成未使用。示例里每个函数都从 main 调用，并把返回值打印出来。不要依赖没有 printf 的返回值自己出现在终端。

```c run expect="42" title="相加"
#include <stdio.h>
int add(int a, int b) { return a + b; }
int main(void) {
  printf("%d\n", add(41, 1));
  return 0;
}
```

```c run expect="42" title="两倍"
#include <stdio.h>
int twice(int n) { return n * 2; }
int main(void) {
  printf("%d\n", twice(21));
  return 0;
}
```

```c run expect="9" title="奇数"
#include <stdio.h>
int odd(int n) { return n % 2 == 1; }
int main(void) {
  int total = 0;
  for (int n = 1; n <= 5; n++) if (odd(n)) total += n;
  printf("%d\n", total);
  return 0;
}
```

### 读「相加」

先做这一例。把代码收成一行来记：`#include <stdio.h> int add(int a, int b) { return a + b; } int main(void) { printf("%d\n", add(41, 1)); return 0; }`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「两倍」

做完上一例再做这一例。把代码收成一行来记：`#include <stdio.h> int twice(int n) { return n * 2; } int main(void) { printf("%d\n", twice(21)); return 0; }`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「奇数」

做完上一例再做这一例。把代码收成一行来记：`#include <stdio.h> int odd(int n) { return n % 2 == 1; } int main(void) { int total = 0; for (int n = 1; n <= 5; n++) if (odd(n)) total += n; printf("…`。先盖住终端，写下你预测的输出，里面要能找到「9」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：相加

这一例要避开的失误是：在定义之前调用，又没有事先声明。。对应的做法是：被调用的函数写在 main 前面。。

把代码收成一行来核对：`#include <stdio.h> int add(int a, int b) { return a + b; } int main(void) { printf("%d\n", add(41, 1)); return 0; }`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

### 只改一处：两倍

这一例要避开的失误是：以为改了参数就会改到调用者的变量。。对应的做法是：要给调用者的结果用 return。。

把代码收成一行来核对：`#include <stdio.h> int twice(int n) { return n * 2; } int main(void) { printf("%d\n", twice(21)); return 0; }`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

### 只改一处：奇数

这一例要避开的失误是：函数有返回值，main 里却不接收也不打印。。对应的做法是：main 里 printf 这个返回值。。

把代码收成一行来核对：`#include <stdio.h> int odd(int n) { return n % 2 == 1; } int main(void) { int total = 0; for (int n = 1; n <= 5; n++) if (odd(n)) total += n; printf("…`。盖住终端，先写下预测，里面要能找到「9」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「9」才算失败。

## 读完再动手

本章要留下的是 「把计算写成函数」、「用参数传入、用返回值传出」、「在调用之前看见声明」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 在定义之前调用，又没有事先声明。
- 以为改了参数就会改到调用者的变量。
- 函数有返回值，main 里却不接收也不打印。

## 最佳实践

- 被调用的函数写在 main 前面。
- 要给调用者的结果用 return。
- main 里 printf 这个返回值。

## 小结

函数用参数接收、用 return 交回。传递的是值。终端只看见 printf，不看见返回值本身。

## 练习

写函数返回参数的平方，用 6 调用并打印。

::: answer 参考答案：平方
```c run expect="36" title="参考答案"
#include <stdio.h>
int sq(int n) { return n * n; }
int main(void) {
  printf("%d\n", sq(6));
  return 0;
}
```
:::

写函数返回两个数里较大的一个，打印 3 和 9 的结果。

::: answer 参考答案：较大
```c run expect="9" title="参考答案"
#include <stdio.h>
int larger(int a, int b) { return a > b ? a : b; }
int main(void) {
  printf("%d\n", larger(3, 9));
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
