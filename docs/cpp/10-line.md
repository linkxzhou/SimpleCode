---
language: cpp
chapter: 10
title: "读入一行"
level: advanced
minutes: 18
goals:
  - "用 getline 读入一行"
  - "失败时不要使用空字符串当成功"
  - "从一行里取出整数"
sources:
  - learncpp
  - cpp-core
  - cppreference
updated: "2026-10-15"
---

std::getline 把一行读进 string，不包含换行。失败时返回的流为假，不要把空字符串当成用户输入。文档示例带上标准输入。你自己在终端跑，就要亲手输入。

读到的文本如果应当是整数，再转换成数。本教程用一个很小的循环或字符串流。为了少引入失败方式，示例优先打印读到的整行，或在知道它是数字时用 std::stoi。stoi 在无法转换时会抛异常，所以只对确定是数字的输入使用，无法确定时先检查每个字符。

检查写法：空行不算数；有字符且都是数字时再 stoi。这样不会走到抛异常的路径。

```cpp run stdin="Ada\n" expect="Ada" title="整行"
#include <iostream>
#include <string>
int main() {
  std::string line;
  if (!std::getline(std::cin, line)) return 1;
  std::cout << line << "\n";
  return 0;
}
```

```cpp run stdin="41\n" expect="42" title="加一"
#include <iostream>
#include <string>
int main() {
  std::string line;
  if (!std::getline(std::cin, line)) return 1;
  int n = std::stoi(line);
  std::cout << (n + 1) << "\n";
  return 0;
}
```

```cpp run stdin="\n" expect="失败" title="空行"
#include <iostream>
#include <string>
int main() {
  std::string line;
  if (!std::getline(std::cin, line) || line.empty()) std::cout << "失败\n";
  else std::cout << line << "\n";
  return 0;
}
```

### 读「整行」

先做这一例。把代码收成一行来记：`#include <iostream> #include <string> int main() { std::string line; if (!std::getline(std::cin, line)) return 1; std::cout << line << "\n"; return 0;…`。先盖住终端，写下你预测的输出，里面要能找到「Ada」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「加一」

做完上一例再做这一例。把代码收成一行来记：`#include <iostream> #include <string> int main() { std::string line; if (!std::getline(std::cin, line)) return 1; int n = std::stoi(line); std::cout <…`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「空行」

做完上一例再做这一例。把代码收成一行来记：`#include <iostream> #include <string> int main() { std::string line; if (!std::getline(std::cin, line) || line.empty()) std::cout << "失败\n"; else std:…`。先盖住终端，写下你预测的输出，里面要能找到「失败」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：整行

这一例要避开的失误是：不看 getline 是否成功。。对应的做法是：getline 失败或空行时打印固定短词。。

把代码收成一行来核对：`#include <iostream> #include <string> int main() { std::string line; if (!std::getline(std::cin, line)) return 1; std::cout << line << "\n"; return 0;…`。盖住终端，先写下预测，里面要能找到「Ada」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「Ada」才算失败。

### 只改一处：加一

这一例要避开的失误是：对不确定的文本调用 stoi，走到异常。。对应的做法是：只有确认是整数时才 stoi。。

把代码收成一行来核对：`#include <iostream> #include <string> int main() { std::string line; if (!std::getline(std::cin, line)) return 1; int n = std::stoi(line); std::cout <…`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

### 只改一处：空行

这一例要避开的失误是：把换行留在比较里，和期望对不上。getline 已经去掉换行。。对应的做法是：示例写上 stdin。。

把代码收成一行来核对：`#include <iostream> #include <string> int main() { std::string line; if (!std::getline(std::cin, line) || line.empty()) std::cout << "失败\n"; else std:…`。盖住终端，先写下预测，里面要能找到「失败」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「失败」才算失败。

## 读完再动手

本章要留下的是 「用 getline 读入一行」、「失败时不要使用空字符串当成功」、「从一行里取出整数」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 不看 getline 是否成功。
- 对不确定的文本调用 stoi，走到异常。
- 把换行留在比较里，和期望对不上。getline 已经去掉换行。

## 最佳实践

- getline 失败或空行时打印固定短词。
- 只有确认是整数时才 stoi。
- 示例写上 stdin。

## 小结

getline 读入一行且不含换行。失败和空行要单独处理。stoi 只用于确定的数字文本。

## 练习

读入一行并打印。输入是 SQL。

::: answer 参考答案：原文
```cpp run stdin="SQL\n" expect="SQL" title="参考答案"
#include <iostream>
#include <string>
int main() {
  std::string line;
  if (!std::getline(std::cin, line)) return 1;
  std::cout << line << "\n";
  return 0;
}
```
:::

读入整数并打印两倍。输入是 21。

::: answer 参考答案：两倍
```cpp run stdin="21\n" expect="42" title="参考答案"
#include <iostream>
#include <string>
int main() {
  std::string line;
  if (!std::getline(std::cin, line)) return 1;
  std::cout << (std::stoi(line) * 2) << "\n";
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
