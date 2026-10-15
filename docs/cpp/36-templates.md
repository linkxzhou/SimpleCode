---
language: cpp
chapter: 36
title: "C++ 模板"
level: beginner
minutes: 8
goals:
  - "用函数模板比较两个值"
  - "用类模板保存一种类型"
  - "在调用时写明类型"
sources:
  - learncpp
updated: "2026-10-15"
---

模板在使用时才确定类型。例子只用 `int`。

### 函数模板

`smaller` 返回两个数里更小的那个。

```cpp run expect="3" title="更小"
#include <iostream>
template <typename T>
T smaller(T a, T b) { return a < b ? a : b; }
int main() {
  std::cout << smaller(8, 3) << "\n";
  return 0;
}
```

输出里能看到 `3`。

### 类模板

`Box<int>` 里只放一个整数。

```cpp run expect="18" title="装一个整数"
#include <iostream>
template <typename T>
struct Box { T value; };
int main() {
  Box<int> box{18};
  std::cout << box.value << "\n";
  return 0;
}
```

输出里能看到 `18`。

### 显式类型

调用时写 `<int>`，避免靠参数去猜。

```cpp run expect="18" title="写明 int"
#include <iostream>
template <typename T>
T pick(T a) { return a; }
int main() {
  std::cout << pick<int>(18) << "\n";
  return 0;
}
```

输出里能看到 `18`。
