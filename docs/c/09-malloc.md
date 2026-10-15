---
language: c
chapter: 9
title: "malloc"
level: advanced
minutes: 18
goals:
  - "按字节数分配"
  - "检查 NULL"
  - "用完 free"
sources:
  - beej-c
  - modern-c
  - learn-c
updated: "2026-10-15"
---

malloc 向运行时要一块内存，参数是字节数。sizeof *p 让字节数跟着指针的类型走，比手写 sizeof(int) 更不容易和类型脱节。失败时返回 NULL，必须先判断再写入。

这块内存不会在函数返回时自动消失。用完 free。free 之后不再使用这块地址。本教程不 free 两次，也不 free 栈上的变量。

分配一个 int 只是为了看清配对。能放在栈上的小对象不必 malloc。当个数来自输入、编译时还不知道时，再考虑堆。

```c run expect="42" title="一个数"
#include <stdio.h>
#include <stdlib.h>
int main(void) {
  int *p = malloc(sizeof *p);
  if (!p) return 1;
  *p = 42;
  printf("%d\n", *p);
  free(p);
  return 0;
}
```

```c run expect="6" title="三个"
#include <stdio.h>
#include <stdlib.h>
int main(void) {
  int *a = malloc(sizeof *a * 3);
  if (!a) return 1;
  a[0] = 1;
  a[1] = 2;
  a[2] = 3;
  printf("%d\n", a[0] + a[1] + a[2]);
  free(a);
  return 0;
}
```

```c run expect="42" title="清零"
#include <stdio.h>
#include <stdlib.h>
int main(void) {
  int *p = calloc(1, sizeof *p);
  if (!p) return 1;
  printf("%d\n", *p + 42);
  free(p);
  return 0;
}
```

### 读「一个数」

先做这一例。把代码收成一行来记：`#include <stdio.h> #include <stdlib.h> int main(void) { int *p = malloc(sizeof *p); if (!p) return 1; *p = 42; printf("%d\n", *p); free(p); return 0; …`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「三个」

做完上一例再做这一例。把代码收成一行来记：`#include <stdio.h> #include <stdlib.h> int main(void) { int *a = malloc(sizeof *a * 3); if (!a) return 1; a[0] = 1; a[1] = 2; a[2] = 3; printf("%d\n",…`。先盖住终端，写下你预测的输出，里面要能找到「6」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「清零」

做完上一例再做这一例。把代码收成一行来记：`#include <stdio.h> #include <stdlib.h> int main(void) { int *p = calloc(1, sizeof *p); if (!p) return 1; printf("%d\n", *p + 42); free(p); return 0; }`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：一个数

这一例要避开的失误是：不检查 NULL 就写入。。对应的做法是：分配用 sizeof *指针。。

把代码收成一行来核对：`#include <stdio.h> #include <stdlib.h> int main(void) { int *p = malloc(sizeof *p); if (!p) return 1; *p = 42; printf("%d\n", *p); free(p); return 0; …`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

### 只改一处：三个

这一例要避开的失误是：free 之后还通过那个指针读取。。对应的做法是：每一条成功的 malloc 对应一条 free。。

把代码收成一行来核对：`#include <stdio.h> #include <stdlib.h> int main(void) { int *a = malloc(sizeof *a * 3); if (!a) return 1; a[0] = 1; a[1] = 2; a[2] = 3; printf("%d\n",…`。盖住终端，先写下预测，里面要能找到「6」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「6」才算失败。

### 只改一处：清零

这一例要避开的失误是：字节数写成元素个数，少乘 sizeof。。对应的做法是：小的固定对象放在栈上。。

把代码收成一行来核对：`#include <stdio.h> #include <stdlib.h> int main(void) { int *p = calloc(1, sizeof *p); if (!p) return 1; printf("%d\n", *p + 42); free(p); return 0; }`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

## 读完再动手

本章要留下的是 「按字节数分配」、「检查 NULL」、「用完 free」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 不检查 NULL 就写入。
- free 之后还通过那个指针读取。
- 字节数写成元素个数，少乘 sizeof。

## 最佳实践

- 分配用 sizeof *指针。
- 每一条成功的 malloc 对应一条 free。
- 小的固定对象放在栈上。

## 小结

malloc 按字节分配，失败得到 NULL。用完 free，之后不再碰那块内存。

## 练习

分配一个 int，写入 7，打印后释放。

::: answer 参考答案：写入
```c run expect="7" title="参考答案"
#include <stdio.h>
#include <stdlib.h>
int main(void) {
  int *p = malloc(sizeof *p);
  if (!p) return 1;
  *p = 7;
  printf("%d\n", *p);
  free(p);
  return 0;
}
```
:::

分配两个 int，放入 20 和 22，打印和并释放。

::: answer 参考答案：求和
```c run expect="42" title="参考答案"
#include <stdio.h>
#include <stdlib.h>
int main(void) {
  int *a = malloc(sizeof *a * 2);
  if (!a) return 1;
  a[0] = 20;
  a[1] = 22;
  printf("%d\n", a[0] + a[1]);
  free(a);
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
