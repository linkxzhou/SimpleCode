---
language: cpp
chapter: 9
title: "algorithm"
level: advanced
minutes: 18
goals:
  - "用 min_element 找最小"
  - "用 count 数相等的元素"
  - "用 count_if 数满足条件的元素"
sources:
  - learncpp
  - cpp-core
  - cppreference
updated: "2026-10-15"
---

algorithm 里的算法接收一段迭代器范围。vector 的 begin 和 end 表示整段。min_element 返回指向最小元素的迭代器，要先确认区间不是空的，再解引用。count 数某个值出现了几次，不改容器。

count_if 配一个函数或 lambda，数使条件为真的元素。lambda 写成 [](int n) { return n % 2 == 1; }。它也不改容器。

std::sort 会改原来的顺序，但这份 libc++ 在链接时缺少 __lttf2，可运行示例不用它。排序留在只读块里。要最小的元素时用 min_element，不要为了取最小去 sort。

```cpp run expect="1" title="最小"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> a{3, 1, 2};
  auto it = std::min_element(a.begin(), a.end());
  std::cout << *it << "\n";
  return 0;
}
```

```cpp norun title="排序不可用"
/* std::sort 会把这段 libc++ 带进缺少 __lttf2 的链接。
   可运行示例改用 min_element 或 count。 */
```

```cpp run expect="2" title="数二"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> a{1, 2, 2, 3};
  int n = std::count(a.begin(), a.end(), 2);
  std::cout << n << "\n";
  return 0;
}
```

```cpp run expect="3" title="奇数个数"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> a{1, 2, 3, 4, 5};
  int n = std::count_if(a.begin(), a.end(), [](int x) { return x % 2 == 1; });
  std::cout << n << "\n";
  return 0;
}
```

### 读「最小」

先做这一例。把代码收成一行来记：`#include <algorithm> #include <iostream> #include <vector> int main() { std::vector<int> a{3, 1, 2}; auto it = std::min_element(a.begin(), a.end()); s…`。先盖住终端，写下你预测的输出，里面要能找到「1」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

「排序不可用」故意不能运行。先读它旁边的限制，再回到能点 Run 的例子上改一个值。不要把只读块当成坏掉的按钮。

### 读「数二」

做完上一例再做这一例。把代码收成一行来记：`#include <algorithm> #include <iostream> #include <vector> int main() { std::vector<int> a{1, 2, 2, 3}; int n = std::count(a.begin(), a.end(), 2); std…`。先盖住终端，写下你预测的输出，里面要能找到「2」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「奇数个数」

做完上一例再做这一例。把代码收成一行来记：`#include <algorithm> #include <iostream> #include <vector> int main() { std::vector<int> a{1, 2, 3, 4, 5}; int n = std::count_if(a.begin(), a.end(), […`。先盖住终端，写下你预测的输出，里面要能找到「3」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：最小

这一例要避开的失误是：对空 vector 解引用 min_element 的结果。。对应的做法是：用算法前确认区间非空，或自己处理空。。

把代码收成一行来核对：`#include <algorithm> #include <iostream> #include <vector> int main() { std::vector<int> a{3, 1, 2}; auto it = std::min_element(a.begin(), a.end()); s…`。盖住终端，先写下预测，里面要能找到「1」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「1」才算失败。

### 限制：排序不可用

这一段故意不能运行。旁边的限制是：在这份环境里调用 std::sort，链接失败。。做法是：要最小元素用 min_element，不调用 std::sort。。把它留在抽屉里对照，不要粘进主编辑器再点工具栏的 Run。能运行的例子在它前后，改那些例子时不要把这里的调用加进去。

### 只改一处：数二

这一例要避开的失误是：count_if 的条件写反。。对应的做法是：条件写成看得到的 lambda。。

把代码收成一行来核对：`#include <algorithm> #include <iostream> #include <vector> int main() { std::vector<int> a{1, 2, 2, 3}; int n = std::count(a.begin(), a.end(), 2); std…`。盖住终端，先写下预测，里面要能找到「2」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「2」才算失败。

### 只改一处：奇数个数

这一例要避开的失误是：对空 vector 解引用 min_element 的结果。。对应的做法是：用算法前确认区间非空，或自己处理空。。

把代码收成一行来核对：`#include <algorithm> #include <iostream> #include <vector> int main() { std::vector<int> a{1, 2, 3, 4, 5}; int n = std::count_if(a.begin(), a.end(), […`。盖住终端，先写下预测，里面要能找到「3」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「3」才算失败。

## 读完再动手

本章要留下的是 「用 min_element 找最小」、「用 count 数相等的元素」、「用 count_if 数满足条件的元素」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 对空 vector 解引用 min_element 的结果。
- 在这份环境里调用 std::sort，链接失败。
- count_if 的条件写反。

## 最佳实践

- 用算法前确认区间非空，或自己处理空。
- 要最小元素用 min_element，不调用 std::sort。
- 条件写成看得到的 lambda。

## 小结

algorithm 作用在一段范围上。min_element、count 和 count_if 不改容器。std::sort 在这里链接不过，不要放进可运行示例。

## 练习

用 max_element 打印 {1, 4, 2} 的最大元素。

::: answer 参考答案：最大
```cpp run expect="4" title="参考答案"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> a{1, 4, 2};
  auto it = std::max_element(a.begin(), a.end());
  std::cout << *it << "\n";
  return 0;
}
```
:::

数出 {1, 2, 3, 4} 里的偶数个数。

::: answer 参考答案：偶数
```cpp run expect="2" title="参考答案"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> a{1, 2, 3, 4};
  int n = std::count_if(a.begin(), a.end(), [](int x) { return x % 2 == 0; });
  std::cout << n << "\n";
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
