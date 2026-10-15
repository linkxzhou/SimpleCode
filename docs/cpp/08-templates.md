---
language: cpp
chapter: 8
title: "函数模板"
level: advanced
minutes: 18
goals:
  - "用一个模板处理 int"
  - "知道模板在调用时确定类型"
  - "不把模板写成能接受任意不相关的类型还假装能加"
sources:
  - learncpp
  - cpp-core
  - cppreference
updated: "2026-10-15"
---

函数模板在调用时按参数生成具体函数。add<int> 或让编译器从参数推断。本教程的模板只做同一类型的相加或取较大者，两边类型一致。

模板写在调用之前。它不是运行时的多态。类型对不上时，编译失败，终端里是诊断。

能写成普通函数就不必上模板。模板适合「int 和别的算术类型写法一样」这一类重复。示例仍用 int，这样输出是稳定的数字。

```cpp run expect="42" title="相加"
#include <iostream>
template <typename T>
T add(T a, T b) { return a + b; }
int main() {
  std::cout << add(19, 23) << "\n";
  return 0;
}
```

```cpp run expect="9" title="较大"
#include <iostream>
template <typename T>
T larger(T a, T b) { return a > b ? a : b; }
int main() {
  std::cout << larger(3, 9) << "\n";
  return 0;
}
```

```cpp run expect="42" title="两倍"
#include <iostream>
template <typename T>
T twice(T n) { return n + n; }
int main() {
  std::cout << twice(21) << "\n";
  return 0;
}
```

### 读「相加」

先做这一例。把代码收成一行来记：`#include <iostream> template <typename T> T add(T a, T b) { return a + b; } int main() { std::cout << add(19, 23) << "\n"; return 0; }`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「较大」

做完上一例再做这一例。把代码收成一行来记：`#include <iostream> template <typename T> T larger(T a, T b) { return a > b ? a : b; } int main() { std::cout << larger(3, 9) << "\n"; return 0; }`。先盖住终端，写下你预测的输出，里面要能找到「9」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「两倍」

做完上一例再做这一例。把代码收成一行来记：`#include <iostream> template <typename T> T twice(T n) { return n + n; } int main() { std::cout << twice(21) << "\n"; return 0; }`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：相加

这一例要避开的失误是：两边参数类型不同，推断失败还继续改运行逻辑。。对应的做法是：调用时让两边类型相同。。

把代码收成一行来核对：`#include <iostream> template <typename T> T add(T a, T b) { return a + b; } int main() { std::cout << add(19, 23) << "\n"; return 0; }`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

### 只改一处：较大

这一例要避开的失误是：在模板里使用类型并不支持的操作。。对应的做法是：模板放在使用它的函数前面。。

把代码收成一行来核对：`#include <iostream> template <typename T> T larger(T a, T b) { return a > b ? a : b; } int main() { std::cout << larger(3, 9) << "\n"; return 0; }`。盖住终端，先写下预测，里面要能找到「9」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「9」才算失败。

### 只改一处：两倍

这一例要避开的失误是：把模板当成运行时可以换类型的容器。。对应的做法是：先用 int 把行为核对清楚。。

把代码收成一行来核对：`#include <iostream> template <typename T> T twice(T n) { return n + n; } int main() { std::cout << twice(21) << "\n"; return 0; }`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

## 读完再动手

本章要留下的是 「用一个模板处理 int」、「知道模板在调用时确定类型」、「不把模板写成能接受任意不相关的类型还假装能加」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 两边参数类型不同，推断失败还继续改运行逻辑。
- 在模板里使用类型并不支持的操作。
- 把模板当成运行时可以换类型的容器。

## 最佳实践

- 调用时让两边类型相同。
- 模板放在使用它的函数前面。
- 先用 int 把行为核对清楚。

## 小结

函数模板在编译时按类型生成函数。参数类型要能完成模板里的运算。示例用 int 核对数字。

## 练习

写模板返回两数之积，打印 6 和 7。

::: answer 参考答案：积
```cpp run expect="42" title="参考答案"
#include <iostream>
template <typename T>
T mul(T a, T b) { return a * b; }
int main() {
  std::cout << mul(6, 7) << "\n";
  return 0;
}
```
:::

写模板返回较小的数，打印 4 和 1 的结果。

::: answer 参考答案：较小
```cpp run expect="1" title="参考答案"
#include <iostream>
template <typename T>
T smaller(T a, T b) { return a < b ? a : b; }
int main() {
  std::cout << smaller(4, 1) << "\n";
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
