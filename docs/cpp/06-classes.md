---
language: cpp
chapter: 6
title: "类"
level: intermediate
minutes: 18
goals:
  - "用构造函数保存每个对象的数据"
  - "区分类里的成员函数"
  - "不把每个对象的数据放进全局变量"
sources:
  - learncpp
  - cpp-core
  - cppreference
updated: "2026-10-15"
---

class 把数据和操作放在一起。构造函数在创建对象时运行，初始化列表把字段设好。成员函数通过对象调用，能读到这个对象的字段。

这一章不写继承的复杂层次。需要另一种行为时，写另一个函数或在成员函数里分支。字段放在类里，不要放进所有对象共享的全局变量，否则一个对象改了，另一个也看见。

打印时 cout 你关心的那个字段或成员函数的返回值。不要指望对象自己知道怎么打印，除非你写了那样的函数。

```cpp run expect="10" title="两倍宽"
#include <iostream>
class Line {
 public:
  Line(int width) : width_(width) {}
  int span() const { return width_ * 2; }
 private:
  int width_;
};
int main() {
  Line line(5);
  std::cout << line.span() << "\n";
  return 0;
}
```

```cpp run expect="m" title="名字"
#include <iostream>
#include <string>
class Unit {
 public:
  Unit(std::string name) : name_(name) {}
  const std::string &name() const { return name_; }
 private:
  std::string name_;
};
int main() {
  Unit u("m");
  std::cout << u.name() << "\n";
  return 0;
}
```

```cpp run expect="42" title="加一"
#include <iostream>
class Num {
 public:
  Num(int n) : n_(n) {}
  int next() const { return n_ + 1; }
 private:
  int n_;
};
int main() {
  Num num(41);
  std::cout << num.next() << "\n";
  return 0;
}
```

### 读「两倍宽」

先做这一例。把代码收成一行来记：`#include <iostream> class Line { public: Line(int width) : width_(width) {} int span() const { return width_ * 2; } private: int width_; }; int main()…`。先盖住终端，写下你预测的输出，里面要能找到「10」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「名字」

做完上一例再做这一例。把代码收成一行来记：`#include <iostream> #include <string> class Unit { public: Unit(std::string name) : name_(name) {} const std::string &name() const { return name_; } p…`。先盖住终端，写下你预测的输出，里面要能找到「m」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「加一」

做完上一例再做这一例。把代码收成一行来记：`#include <iostream> class Num { public: Num(int n) : n_(n) {} int next() const { return n_ + 1; } private: int n_; }; int main() { Num num(41); std::c…`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：两倍宽

这一例要避开的失误是：把每个对象自己的数写成全局变量。。对应的做法是：字段在初始化列表里赋值。。

把代码收成一行来核对：`#include <iostream> class Line { public: Line(int width) : width_(width) {} int span() const { return width_ * 2; } private: int width_; }; int main()…`。盖住终端，先写下预测，里面要能找到「10」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「10」才算失败。

### 只改一处：名字

这一例要避开的失误是：构造函数忘记初始化字段。。对应的做法是：不修改对象的成员函数标成 const。。

把代码收成一行来核对：`#include <iostream> #include <string> class Unit { public: Unit(std::string name) : name_(name) {} const std::string &name() const { return name_; } p…`。盖住终端，先写下预测，里面要能找到「m」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「m」才算失败。

### 只改一处：加一

这一例要避开的失误是：成员函数没有 const，只读也被标成会修改。。对应的做法是：每个对象的数据放在字段里。。

把代码收成一行来核对：`#include <iostream> class Num { public: Num(int n) : n_(n) {} int next() const { return n_ + 1; } private: int n_; }; int main() { Num num(41); std::c…`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

## 读完再动手

本章要留下的是 「用构造函数保存每个对象的数据」、「区分类里的成员函数」、「不把每个对象的数据放进全局变量」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 把每个对象自己的数写成全局变量。
- 构造函数忘记初始化字段。
- 成员函数没有 const，只读也被标成会修改。

## 最佳实践

- 字段在初始化列表里赋值。
- 不修改对象的成员函数标成 const。
- 每个对象的数据放在字段里。

## 小结

类用构造函数和字段保存每个对象的数据。成员函数通过对象调用。不要用全局变量冒充字段。

## 练习

类保存一个数，成员函数返回两倍。打印初值 21 的结果。

::: answer 参考答案：两倍
```cpp run expect="42" title="参考答案"
#include <iostream>
class Num {
 public:
  Num(int n) : n_(n) {}
  int twice() const { return n_ * 2; }
 private:
  int n_;
};
int main() {
  std::cout << Num(21).twice() << "\n";
  return 0;
}
```
:::

类保存字符串标签 Ada 并打印。

::: answer 参考答案：标签
```cpp run expect="Ada" title="参考答案"
#include <iostream>
#include <string>
class Tag {
 public:
  Tag(std::string s) : s_(s) {}
  const std::string &get() const { return s_; }
 private:
  std::string s_;
};
int main() {
  Tag t("Ada");
  std::cout << t.get() << "\n";
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
