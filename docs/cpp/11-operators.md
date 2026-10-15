---
language: cpp
chapter: 11
title: "C++ 运算符"
level: beginner
minutes: 8
goals:
  - "算出整数除法和余数"
  - "用 == 比较相等"
  - "用 && 组合两个条件"
sources:
  - learncpp
updated: "2026-10-15"
---

运算符一章只核对三个结果。

### 除法和余数

7 除以 2 的商是 3，余数是 1。

```cpp run expect="3 1" title="商和余数"
#include <iostream>
int main() {
  std::cout << (7 / 2) << " " << (7 % 2) << "\n";
  return 0;
}
```

输出里能看到 `3 1`。

### 相等

`==` 比较的是值。相等时打印 1。

```cpp run expect="1 0" title="相等与否"
#include <iostream>
int main() {
  std::cout << (3 == 3) << " " << (3 == 4) << "\n";
  return 0;
}
```

输出里能看到 `1 0`。

### 并且

两个条件都成立，结果才是 1。

```cpp run expect="1" title="两个都真"
#include <iostream>
int main() {
  int price = 18;
  std::cout << (price > 10 && price < 20) << "\n";
  return 0;
}
```

输出里能看到 `1`。
