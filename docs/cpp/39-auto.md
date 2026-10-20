---
language: cpp
chapter: 39
title: "C++ auto 与范围 for"
level: intermediate
minutes: 9
goals:
  - "让 auto 跟上初始化表达式"
  - "用范围 for 走完数组"
  - "在 vector 上累计大于阈值的个数"
sources:
  - cppreference
  - modern-cpp-tutorial
updated: "2026-10-20"
---

这份编译器是 C++14。`auto` 从初始化式推导类型，不会保留引用，除非写成 `auto &`。范围 for 会在数组和 `vector` 上走一遍。Modern C++ Tutorial 以 MIT 发布，下面的程序没有摘它的段落：https://github.com/changkun/modern-cpp-tutorial 。

### 数组加总

`n` 的类型从 `{1, 2, 3}` 的元素推导为 `int`。范围 for 把三格加进 `sum`，得到 6。

```cpp run expect="6" title="三格之和"
#include <iostream>
int main() {
  int row[] = {1, 2, 3};
  int sum = 0;
  for (auto n : row) sum += n;
  std::cout << sum << "\n";
  return 0;
}
```

三格之和是 6。

### 改的是副本

范围 for 的 `auto n` 是副本。循环里把副本加倍，不会改数组。打印第一个元素仍是 1。要改元素需要 `auto &`。

```cpp run expect="1" title="副本不影响原数组"
#include <iostream>
int main() {
  int row[] = {1, 2, 3};
  for (auto n : row) n = n * 2;
  std::cout << row[0] << "\n";
  return 0;
}
```

第一格仍是 1。

### 引用才能写回

`auto &n` 绑定到元素本身。每个元素加 1 之后，末格从 3 变成 4。

```cpp run expect="4" title="写回末格"
#include <iostream>
int main() {
  int row[] = {1, 2, 3};
  for (auto &n : row) n = n + 1;
  std::cout << row[2] << "\n";
  return 0;
}
```

末格变成 4。

### 练习：数大于 2 的

`vector` 里是 1、4、2、5。范围 for 用 `auto` 取出副本，大于 2 的有 4 和 5，个数是 2。

```cpp run expect="2" title="两个大于 2"
#include <iostream>
#include <vector>
int main() {
  std::vector<int> row{1, 4, 2, 5};
  int count = 0;
  for (auto n : row) {
    if (n > 2) count++;
  }
  std::cout << count << "\n";
  return 0;
}
```

大于 2 的有 2 个。
