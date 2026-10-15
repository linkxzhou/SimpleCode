---
language: cpp
chapter: 2
title: "C++ 环境设置"
level: beginner
minutes: 8
goals:
  - "知道按钮会调用 clang"
  - "让每个变量都被使用"
  - "不要把 g++ 命令写进源文件"
sources:
  - learncpp
updated: "2026-10-15"
---

运行按钮负责编译。源文件里只放 C++ 语句。

### 能编译的一行

下面这份文件没有未使用的名字，警告不会把它拦住。

```cpp run expect="18" title="单价"
#include <iostream>
int main() {
  int price = 18;
  std::cout << price << "\n";
  return 0;
}
```

输出里能看到 `18`。

### 方言停在 C++14

这份 clang 8 默认接近 gnu++14。例子不写结构化绑定，也不写 `std::optional`。

```cpp run expect="18" title="auto 推导"
#include <iostream>
int main() {
  auto price = 18;
  std::cout << price << "\n";
  return 0;
}
```

输出里能看到 `18`。

### 安装命令不是源码

`g++` 是终端里的命令。写进 `.cpp` 不会去编译别的文件。

```cpp norun title="不是 C++ 语句"
g++ main.cpp -o main
```
