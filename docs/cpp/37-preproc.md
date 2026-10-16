---
language: cpp
chapter: 37
title: "C++ 预处理器"
level: beginner
minutes: 8
goals:
  - "用 define 给数字起名"
  - "用 if 0 丢掉一段"
  - "用 ifndef 避免重复定义"
sources:
  - learncpp
updated: "2026-10-15"
---

预处理发生在编译之前。下面的结果仍用 `cout` 核对。

### 宏

`RATE` 在编译前被换成 2。

```cpp run expect="18" title="换成 2"
#include <iostream>
#define RATE 2
int main() {
  std::cout << (9 * RATE) << "\n";
  return 0;
}
```

输出里能看到 `18`。

### 丢掉一段

`#if 0` 里的输出不会出现。

```cpp run expect="kept" title="条件编译"
#include <iostream>
int main() {
#if 0
  std::cout << "hidden\n";
#endif
  std::cout << "kept\n";
  return 0;
}
```

输出里能看到 `kept`。

### 只定义一次

头文件守卫在这个单文件里也能挡住第二次定义。

```cpp run expect="18" title="守卫"
#include <iostream>
#ifndef RATE_H
#define RATE_H
const int kRate = 2;
#endif
int main() {
  std::cout << (9 * kRate) << "\n";
  return 0;
}
```

输出里能看到 `18`。
