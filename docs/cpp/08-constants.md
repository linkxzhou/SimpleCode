---
language: cpp
chapter: 8
title: "C++ 常量"
level: beginner
minutes: 8
goals:
  - "用 const 固定一个变量"
  - "用 constexpr 固定编译期的数"
  - "用枚举给一组序号起名"
sources:
  - learncpp
updated: "2026-10-15"
---

不打算改的数写成常量，读起来比裸数字清楚。

### const

`rate` 用来计算，不再被赋值。

```cpp run expect="18" title="倍率"
#include <iostream>
int main() {
  const int rate = 2;
  std::cout << (9 * rate) << "\n";
  return 0;
}
```

输出里能看到 `18`。

### constexpr

这个基数在编译时就能确定。

```cpp run expect="18" title="基数"
#include <iostream>
int main() {
  constexpr int base = 10;
  std::cout << (base + 8) << "\n";
  return 0;
}
```

输出里能看到 `18`。

### 枚举

枚举项从 0 开始编号。

```cpp run expect="1" title="第二项"
#include <iostream>
enum Color { Red, Green, Blue };
int main() {
  std::cout << Green << "\n";
  return 0;
}
```

输出里能看到 `1`。
