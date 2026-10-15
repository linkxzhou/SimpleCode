---
language: cpp
chapter: 15
title: "C++ 数字"
level: beginner
minutes: 8
goals:
  - "区分整数除法和小数除法"
  - "用 abs 去掉负号"
  - "用 double 保存 1.5"
sources:
  - learncpp
updated: "2026-10-15"
---

数字一章只核对运算结果，不引入随机数。

### 小数除法

有一边是小数时，商会保留 0.5。

```cpp run expect="3.5" title="保留小数"
#include <iostream>
int main() {
  std::cout << (7 / 2.0) << "\n";
  return 0;
}
```

输出里能看到 `3.5`。

### 绝对值

`std::abs` 把 -4 收成 4。

```cpp run expect="4" title="去掉负号"
#include <cstdlib>
#include <iostream>
int main() {
  std::cout << std::abs(-4) << "\n";
  return 0;
}
```

输出里能看到 `4`。

### 小数变量

`1.5` 放进 `double` 后再打印。

```cpp run expect="1.5" title="长度"
#include <iostream>
int main() {
  double length = 1.5;
  std::cout << length << "\n";
  return 0;
}
```

输出里能看到 `1.5`。
