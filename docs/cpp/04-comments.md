---
language: cpp
chapter: 4
title: "C++ 注释"
level: beginner
minutes: 8
goals:
  - "用 // 注释一行"
  - "用块注释跳过一段"
  - "知道注释里的输出不会出现"
sources:
  - learncpp
updated: "2026-10-15"
---

注释给读者看。编译器会把它丢掉。

### 行注释

双斜线后面的输出不会执行。

```cpp run expect="kept" title="行注释"
#include <iostream>
int main() {
  // std::cout << "隐藏\n";
  std::cout << "kept\n";
  return 0;
}
```

输出里能看到 `kept`。

### 块注释

`/*` 到 `*/` 之间整段都不参加编译。

```cpp run expect="third" title="块注释"
#include <iostream>
int main() {
  /* std::cout << "甲\n";
     std::cout << "乙\n"; */
  std::cout << "third\n";
  return 0;
}
```

输出里能看到 `third`。

### 注释不能嵌套块

行注释可以写在语句后面，说明这个数是单价。

```cpp run expect="18" title="行尾注释"
#include <iostream>
int main() {
  int price = 18; // 单价
  std::cout << price << "\n";
  return 0;
}
```

输出里能看到 `18`。
