---
language: cpp
chapter: 7
title: "失败不用异常"
level: advanced
minutes: 18
goals:
  - "用返回值表示失败"
  - "成功时才读取输出参数"
  - "不在可运行示例里 throw"
sources:
  - learncpp
  - cpp-core
  - cppreference
updated: "2026-10-15"
---

除以零、解析失败这些情况，用返回值告诉调用者。一种简单约定：函数返回 1 表示成功，返回 0 表示失败，结果经引用参数交回。失败时不要读取那个结果。

throw 留在只读块里。这份编译目标上的异常不可靠，可运行示例不依赖它。能事先判断的情况用 if，例如除数是不是 0。

打印时失败打出固定的词「失败」，成功打出数字。不要把编译器的诊断文本写进期望。

```cpp norun title="只读"
/* throw 不放进可运行示例。
   int n = 0;
   throw n;
*/
```

```cpp run expect="3" title="除法"
#include <iostream>
int divide(int a, int b, int &out) {
  if (b == 0) return 0;
  out = a / b;
  return 1;
}
int main() {
  int q = 0;
  if (!divide(20, 6, q)) std::cout << "失败\n";
  else std::cout << q << "\n";
  return 0;
}
```

```cpp run expect="失败" title="除零"
#include <iostream>
int divide(int a, int b, int &out) {
  if (b == 0) return 0;
  out = a / b;
  return 1;
}
int main() {
  int q = 0;
  if (!divide(1, 0, q)) std::cout << "失败\n";
  else std::cout << q << "\n";
  return 0;
}
```

```cpp run expect="21" title="整除成功"
#include <iostream>
int divide(int a, int b, int &out) {
  if (b == 0) return 0;
  out = a / b;
  return 1;
}
int main() {
  int q = 0;
  if (!divide(42, 2, q)) std::cout << "失败\n";
  else std::cout << q << "\n";
  return 0;
}
```

「只读」故意不能运行。先读它旁边的限制，再回到能点 Run 的例子上改一个值。不要把只读块当成坏掉的按钮。

### 读「除法」

做完上一例再做这一例。把代码收成一行来记：`#include <iostream> int divide(int a, int b, int &out) { if (b == 0) return 0; out = a / b; return 1; } int main() { int q = 0; if (!divide(20, 6, q))…`。先盖住终端，写下你预测的输出，里面要能找到「3」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「除零」

做完上一例再做这一例。把代码收成一行来记：`#include <iostream> int divide(int a, int b, int &out) { if (b == 0) return 0; out = a / b; return 1; } int main() { int q = 0; if (!divide(1, 0, q)) …`。先盖住终端，写下你预测的输出，里面要能找到「失败」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「整除成功」

做完上一例再做这一例。把代码收成一行来记：`#include <iostream> int divide(int a, int b, int &out) { if (b == 0) return 0; out = a / b; return 1; } int main() { int q = 0; if (!divide(42, 2, q))…`。先盖住终端，写下你预测的输出，里面要能找到「21」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 限制：只读

这一段故意不能运行。旁边的限制是：失败了仍使用输出参数里的旧值。。做法是：成功才读输出参数。。把它留在抽屉里对照，不要粘进主编辑器再点工具栏的 Run。能运行的例子在它前后，改那些例子时不要把这里的调用加进去。

### 只改一处：除法

这一例要避开的失误是：用 throw 表示除零。。对应的做法是：失败打印固定短词。。

把代码收成一行来核对：`#include <iostream> int divide(int a, int b, int &out) { if (b == 0) return 0; out = a / b; return 1; } int main() { int q = 0; if (!divide(20, 6, q))…`。盖住终端，先写下预测，里面要能找到「3」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「3」才算失败。

### 只改一处：除零

这一例要避开的失误是：返回值的 0 和 1 没有在调用处分支。。对应的做法是：同一份约定贯穿调用处。。

把代码收成一行来核对：`#include <iostream> int divide(int a, int b, int &out) { if (b == 0) return 0; out = a / b; return 1; } int main() { int q = 0; if (!divide(1, 0, q)) …`。盖住终端，先写下预测，里面要能找到「失败」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「失败」才算失败。

### 只改一处：整除成功

这一例要避开的失误是：失败了仍使用输出参数里的旧值。。对应的做法是：成功才读输出参数。。

把代码收成一行来核对：`#include <iostream> int divide(int a, int b, int &out) { if (b == 0) return 0; out = a / b; return 1; } int main() { int q = 0; if (!divide(42, 2, q))…`。盖住终端，先写下预测，里面要能找到「21」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「21」才算失败。

## 读完再动手

本章要留下的是 「用返回值表示失败」、「成功时才读取输出参数」、「不在可运行示例里 throw」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 失败了仍使用输出参数里的旧值。
- 用 throw 表示除零。
- 返回值的 0 和 1 没有在调用处分支。

## 最佳实践

- 成功才读输出参数。
- 失败打印固定短词。
- 同一份约定贯穿调用处。

## 小结

失败用返回值。成功才使用输出参数。throw 不进入可运行示例。

## 练习

用返回值约定计算 17/5 并打印。

::: answer 参考答案：商
```cpp run expect="3" title="参考答案"
#include <iostream>
int divide(int a, int b, int &out) {
  if (b == 0) return 0;
  out = a / b;
  return 1;
}
int main() {
  int q = 0;
  if (!divide(17, 5, q)) return 1;
  std::cout << q << "\n";
  return 0;
}
```
:::

除数为 0 时打印失败。

::: answer 参考答案：失败
```cpp run expect="失败" title="参考答案"
#include <iostream>
int divide(int a, int b, int &out) {
  if (b == 0) return 0;
  out = a / b;
  return 1;
}
int main() {
  int q = 0;
  if (!divide(1, 0, q)) std::cout << "失败\n";
  return 0;
}
```
:::

## 延伸阅读

- [LearnCpp](https://www.learncpp.com/)（仅链接）
- [C++ Core Guidelines](https://github.com/isocpp/CppCoreGuidelines)（仅链接）
- [cppreference](https://en.cppreference.com/)（CC BY-SA 3.0，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 LearnCpp、C++ Core Guidelines 与 cppreference，没有逐字搬用原文。
