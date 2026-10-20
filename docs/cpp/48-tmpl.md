---
language: cpp
chapter: 48
title: "C++ 模板进阶"
level: advanced
minutes: 10
goals:
  - "为 int 写一个特化"
  - "用可变参数把若干 int 相加"
  - "用非类型参数当倍数"
sources:
  - cppreference
  - modern-cpp-tutorial
updated: "2026-10-20"
---

第 36 章写过最简单的函数模板。这一章加上特化、参数包和非类型参数。仍然只用 `int`，避免在输出里格式化浮点。特化在调用前必须已经被看到。

### int 的特化多加一

主模板原样返回。`int` 的特化把结果加 1。`id(4)` 走特化，得到 5。

```cpp run expect="5" title="特化加一"
#include <iostream>
template <typename T>
T id(T value) { return value; }
template <>
int id<int>(int value) { return value + 1; }
int main() {
  std::cout << id(4) << "\n";
  return 0;
}
```

特化后是 5。

### 参数包相加

递归的 `add` 每次吃掉一个 `int`，最后只剩一个参数时返回它自己。`add(1, 2, 4)` 是 7。

```cpp run expect="7" title="三个相加"
#include <iostream>
template <typename T>
T add(T value) { return value; }
template <typename T, typename... Rest>
T add(T value, Rest... rest) { return value + add(rest...); }
int main() {
  std::cout << add(1, 2, 4) << "\n";
  return 0;
}
```

1、2、4 之和是 7。

### 非类型参数

`twice<5>()` 的 `5` 是编译期常量，不是函数参数。函数体把它乘 2，得到 10。

```cpp run expect="10" title="编译期的 5"
#include <iostream>
template <int N>
int twice() { return N * 2; }
int main() {
  std::cout << twice<5>() << "\n";
  return 0;
}
```

5 的两倍是 10。

### 练习：类模板记住一个数

`Hold<int>` 的字段是 6。`get` 原样返回。类型参数写在类名后面，对象本身不再重复写 `int`。

```cpp run expect="6" title="类模板"
#include <iostream>
template <typename T>
struct Hold {
  T value;
  T get() const { return value; }
};
int main() {
  Hold<int> box{6};
  std::cout << box.get() << "\n";
  return 0;
}
```

取出来是 6。
