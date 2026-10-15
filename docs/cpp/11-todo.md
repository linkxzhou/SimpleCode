---
language: cpp
chapter: 11
title: "待办小项目"
level: advanced
minutes: 18
goals:
  - "用 vector 保存待办文本"
  - "跳过空行"
  - "打印条数和其中一条"
sources:
  - learncpp
  - cpp-core
  - cppreference
updated: "2026-10-15"
---

待办列表是一次运行里的 vector<string>。没有网络，也不写文件。下次运行列表是空的。规则用函数表达：一行是不是空的、要不要加进去。

示例不从键盘读全部命令，而是直接把几条字符串放进 vector，这样核心逻辑不依赖输入顺序。需要演示读入时，单独用 getline 读一条再放进 vector。

输出只打条数，或打出指定下标的那一条。下标先和 size 比较，越界就打印「失败」。

```cpp run expect="1" title="两条"
#include <iostream>
#include <string>
#include <vector>
int main() {
  std::vector<std::string> items{"买笔", ""};
  int n = 0;
  for (const std::string &s : items) if (!s.empty()) n++;
  std::cout << n << "\n";
  return 0;
}
```

```cpp run expect="买笔" title="第一条"
#include <iostream>
#include <string>
#include <vector>
int main() {
  std::vector<std::string> items{"买笔", "写信"};
  std::cout << items[0] << "\n";
  return 0;
}
```

```cpp run stdin="买笔\n" expect="1" title="读一条"
#include <iostream>
#include <string>
#include <vector>
int main() {
  std::vector<std::string> items;
  std::string line;
  if (!std::getline(std::cin, line) || line.empty()) {
    std::cout << "失败\n";
    return 0;
  }
  items.push_back(line);
  std::cout << items.size() << "\n";
  return 0;
}
```

### 读「两条」

先做这一例。把代码收成一行来记：`#include <iostream> #include <string> #include <vector> int main() { std::vector<std::string> items{"买笔", ""}; int n = 0; for (const std::string &s : …`。先盖住终端，写下你预测的输出，里面要能找到「1」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「第一条」

做完上一例再做这一例。把代码收成一行来记：`#include <iostream> #include <string> #include <vector> int main() { std::vector<std::string> items{"买笔", "写信"}; std::cout << items[0] << "\n"; return…`。先盖住终端，写下你预测的输出，里面要能找到「买笔」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「读一条」

做完上一例再做这一例。把代码收成一行来记：`#include <iostream> #include <string> #include <vector> int main() { std::vector<std::string> items; std::string line; if (!std::getline(std::cin, lin…`。先盖住终端，写下你预测的输出，里面要能找到「1」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：两条

这一例要避开的失误是：把空字符串也算成一条待办。。对应的做法是：空行先排除再计数。。

把代码收成一行来核对：`#include <iostream> #include <string> #include <vector> int main() { std::vector<std::string> items{"买笔", ""}; int n = 0; for (const std::string &s : …`。盖住终端，先写下预测，里面要能找到「1」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「1」才算失败。

### 只改一处：第一条

这一例要避开的失误是：不检查下标就读取。。对应的做法是：只打印条数或一条文本。。

把代码收成一行来核对：`#include <iostream> #include <string> #include <vector> int main() { std::vector<std::string> items{"买笔", "写信"}; std::cout << items[0] << "\n"; return…`。盖住终端，先写下预测，里面要能找到「买笔」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「买笔」才算失败。

### 只改一处：读一条

这一例要避开的失误是：以为列表会留到下一次运行。。对应的做法是：读入失败有固定输出。。

把代码收成一行来核对：`#include <iostream> #include <string> #include <vector> int main() { std::vector<std::string> items; std::string line; if (!std::getline(std::cin, lin…`。盖住终端，先写下预测，里面要能找到「1」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「1」才算失败。

## 读完再动手

本章要留下的是 「用 vector 保存待办文本」、「跳过空行」、「打印条数和其中一条」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 把空字符串也算成一条待办。
- 不检查下标就读取。
- 以为列表会留到下一次运行。

## 最佳实践

- 空行先排除再计数。
- 只打印条数或一条文本。
- 读入失败有固定输出。

## 小结

待办是一次运行内的 vector。空行不算。输出是条数或某一条文本。下次运行不会还在。

## 练习

两条非空待办，打印条数。

::: answer 参考答案：条数
```cpp run expect="2" title="参考答案"
#include <iostream>
#include <string>
#include <vector>
int main() {
  std::vector<std::string> items{"a", "b"};
  std::cout << items.size() << "\n";
  return 0;
}
```
:::

打印第二条待办。

::: answer 参考答案：第二
```cpp run expect="写信" title="参考答案"
#include <iostream>
#include <string>
#include <vector>
int main() {
  std::vector<std::string> items{"买笔", "写信"};
  std::cout << items[1] << "\n";
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
