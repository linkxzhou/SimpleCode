---
language: cpp
chapter: 5
title: "vector 与 string"
level: intermediate
minutes: 18
goals:
  - "用 vector 保存一组数"
  - "用 string 的 size 和 substr"
  - "记住 size 对中文数的是字节"
sources:
  - learncpp
  - cpp-core
  - cppreference
updated: "2026-10-15"
---

std::vector 记住元素个数。下标从 0 开始，size() 是个数。范围 for 用 int n : a 读取每个元素。往末尾加用 push_back。

std::string 保存字符序列。substr(起, 长度) 的第二个数是长度，不是结束下标。size() 数的是 char 的个数，也就是字节。 "Ada" 是 3。"你好" 是 6。不要把 size 理解成你看到的字数。

字符串用 + 拼接。数字不会自动变成文本后拼接，需要时先放进 string 或直接 cout 数字。

```cpp run expect="10" title="求和"
#include <iostream>
#include <vector>
int main() {
  std::vector<int> a{1, 2, 3, 4};
  int total = 0;
  for (int n : a) total += n;
  std::cout << total << "\n";
  return 0;
}
```

```cpp run expect="Simp" title="前四个"
#include <iostream>
#include <string>
int main() {
  std::string s = "SimpleCode";
  std::cout << s.substr(0, 4) << "\n";
  return 0;
}
```

```cpp run expect="6" title="字节数"
#include <iostream>
#include <string>
int main() {
  std::string s = "你好";
  std::cout << s.size() << "\n";
  return 0;
}
```

### 读「求和」

先做这一例。把代码收成一行来记：`#include <iostream> #include <vector> int main() { std::vector<int> a{1, 2, 3, 4}; int total = 0; for (int n : a) total += n; std::cout << total << "\…`。先盖住终端，写下你预测的输出，里面要能找到「10」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「前四个」

做完上一例再做这一例。把代码收成一行来记：`#include <iostream> #include <string> int main() { std::string s = "SimpleCode"; std::cout << s.substr(0, 4) << "\n"; return 0; }`。先盖住终端，写下你预测的输出，里面要能找到「Simp」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「字节数」

做完上一例再做这一例。把代码收成一行来记：`#include <iostream> #include <string> int main() { std::string s = "你好"; std::cout << s.size() << "\n"; return 0; }`。先盖住终端，写下你预测的输出，里面要能找到「6」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：求和

这一例要避开的失误是：把 substr 的第二个参数当成结束下标。。对应的做法是：遍历用范围 for，需要下标时再写经典 for。。

把代码收成一行来核对：`#include <iostream> #include <vector> int main() { std::vector<int> a{1, 2, 3, 4}; int total = 0; for (int n : a) total += n; std::cout << total << "\…`。盖住终端，先写下预测，里面要能找到「10」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「10」才算失败。

### 只改一处：前四个

这一例要避开的失误是：把 string 的 size 当成中文字数。。对应的做法是：切片先记住长度，不是结束位置。。

把代码收成一行来核对：`#include <iostream> #include <string> int main() { std::string s = "SimpleCode"; std::cout << s.substr(0, 4) << "\n"; return 0; }`。盖住终端，先写下预测，里面要能找到「Simp」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「Simp」才算失败。

### 只改一处：字节数

这一例要避开的失误是：下标越过 size。。对应的做法是：讲中文长度时写明是字节。。

把代码收成一行来核对：`#include <iostream> #include <string> int main() { std::string s = "你好"; std::cout << s.size() << "\n"; return 0; }`。盖住终端，先写下预测，里面要能找到「6」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「6」才算失败。

## 读完再动手

本章要留下的是 「用 vector 保存一组数」、「用 string 的 size 和 substr」、「记住 size 对中文数的是字节」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 把 substr 的第二个参数当成结束下标。
- 把 string 的 size 当成中文字数。
- 下标越过 size。

## 最佳实践

- 遍历用范围 for，需要下标时再写经典 for。
- 切片先记住长度，不是结束位置。
- 讲中文长度时写明是字节。

## 小结

vector 知道自己的个数。string 的 substr 第二个参数是长度，size 按字节计。

## 练习

求 {3, 1, 2} 的最小元素并打印。

::: answer 参考答案：三个
```cpp run expect="1" title="参考答案"
#include <iostream>
#include <vector>
int main() {
  std::vector<int> a{3, 1, 2};
  int m = a[0];
  for (int n : a) if (n < m) m = n;
  std::cout << m << "\n";
  return 0;
}
```
:::

把 A 和 B 拼成 AB 并打印。

::: answer 参考答案：拼接
```cpp run expect="AB" title="参考答案"
#include <iostream>
#include <string>
int main() {
  std::string s = std::string("A") + "B";
  std::cout << s << "\n";
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
