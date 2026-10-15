---
language: cpp
chapter: 19
title: "C++ 引用"
level: beginner
minutes: 8
goals:
  - "让引用绑定一个已有变量"
  - "通过引用改原来的值"
  - "知道引用不能悬空着声明"
sources:
  - learncpp
updated: "2026-10-15"
---

引用是另一个名字，必须在声明时绑到对象上。

### 绑定

改引用就是改原来的 `n`。

```cpp run expect="8" title="同一份"
#include <iostream>
int main() {
  int n = 3;
  int &r = n;
  r = 8;
  std::cout << n << "\n";
  return 0;
}
```

输出里能看到 `8`。

### 函数参数

引用参数让函数改调用方，不必传指针。

```cpp run expect="18" title="写回"
#include <iostream>
void set_price(int &price) { price = 18; }
int main() {
  int price = 0;
  set_price(price);
  std::cout << price << "\n";
  return 0;
}
```

输出里能看到 `18`。

### 不能单独声明

没有对象的引用连编译都过不了，所以这一段不运行。

```cpp norun title="没有对象"
int main() {
  int &r;
  return 0;
}
```
