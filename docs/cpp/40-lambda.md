---
language: cpp
chapter: 40
title: "C++ lambda"
level: intermediate
minutes: 9
goals:
  - "写一个就地调用的小函数"
  - "按值捕获外层变量"
  - "把 lambda 传给函数模板"
sources:
  - cppreference
  - modern-cpp-features
updated: "2026-10-20"
---

lambda 是带调用运算符的临时对象。参数写在圆括号里，函数体写在花括号里。捕获列表决定外层变量怎么进来。C++14 没有结构化绑定，捕获仍要写名字。modern-cpp-features 是 MIT，这里不摘它的条目：https://github.com/AnthonyCalandra/modern-cpp-features 。

### 就地加一

`[](int x) { return x + 1; }` 不捕获外层。对 4 调用得到 5。

```cpp run expect="5" title="加一"
#include <iostream>
int main() {
  auto step = [](int x) { return x + 1; };
  std::cout << step(4) << "\n";
  return 0;
}
```

4 加一是 5。

### 按值捕获

外层 `base` 是 3。`[base]` 把当时的 3 抄进 lambda。之后即使改 `base`，已捕获的副本仍是 3，加上 1 得到 4。

```cpp run expect="4" title="捕获的是 3"
#include <iostream>
int main() {
  int base = 3;
  auto step = [base]() { return base + 1; };
  base = 9;
  std::cout << step() << "\n";
  return 0;
}
```

调用结果是 4，外层后来改成 9 不影响它。

### 交给模板

`call` 是函数模板，用参数的类型接住 lambda。传入「乘 2」和 6，得到 12。模板不需要写 lambda 的具体类型名字。

```cpp run expect="12" title="模板调用 lambda"
#include <iostream>
template <typename F>
int call(F fn, int x) { return fn(x); }
int main() {
  std::cout << call([](int n) { return n * 2; }, 6) << "\n";
  return 0;
}
```

6 乘 2 是 12。

### 练习：捕获倍数

捕获 `factor`，它的值是 3。lambda 把参数乘上这份副本。4 乘 3 是 12。

```cpp run expect="12" title="乘上捕获的 3"
#include <iostream>
int main() {
  int factor = 3;
  auto scale = [factor](int n) { return n * factor; };
  std::cout << scale(4) << "\n";
  return 0;
}
```

4 乘以捕获的 3 得到 12。
