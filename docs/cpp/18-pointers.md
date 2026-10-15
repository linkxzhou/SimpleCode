---
language: cpp
chapter: 18
title: "C++ 指针"
level: beginner
minutes: 8
goals:
  - "用 & 取得地址"
  - "用 * 读所指的值"
  - "通过指针改原来的变量"
sources:
  - learncpp
updated: "2026-10-15"
---

指针里放的是地址。没有对象时不要解引用，空指针用 `nullptr` 表示。

### 读出那个整数

先取地址，再用 `*` 看它现在的值。

```cpp run expect="9" title="指向 9"
#include <iostream>
int main() {
  int n = 9;
  int *p = &n;
  std::cout << *p << "\n";
  return 0;
}
```

输出里能看到 `9`。

### 写回原变量

`*p = 8` 改的是 `n` 那一块内存。

```cpp run expect="8" title="改成 8"
#include <iostream>
int main() {
  int n = 3;
  int *p = &n;
  *p = 8;
  std::cout << n << "\n";
  return 0;
}
```

输出里能看到 `8`。

### 空指针

空指针不指向对象。比较结果为真时打印 0。

```cpp run expect="0" title="是空的"
#include <iostream>
int main() {
  int *p = nullptr;
  std::cout << (p == nullptr ? 0 : 1) << "\n";
  return 0;
}
```

输出里能看到 `0`。
