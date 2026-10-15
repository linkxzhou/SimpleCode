---
language: cpp
chapter: 6
title: "C++ 变量"
level: beginner
minutes: 8
goals:
  - "先声明再使用"
  - "给局部变量赋初值"
  - "同一名字可以再赋值"
sources:
  - learncpp
updated: "2026-10-15"
---

局部变量在使用前写上初值。未使用的名字会让编译失败。

### 声明并赋值

类型写在名字前面。

```cpp run expect="18" title="单价"
#include <iostream>
int main() {
  int price = 18;
  std::cout << price << "\n";
  return 0;
}
```

输出里能看到 `18`。

### 再改一次

赋值会换掉原来的数。

```cpp run expect="4" title="改成 4"
#include <iostream>
int main() {
  int n = 1;
  n = 4;
  std::cout << n << "\n";
  return 0;
}
```

输出里能看到 `4`。

### 字符用单引号

单引号是一个字符，双引号是字符串。

```cpp run expect="B" title="一个字符"
#include <iostream>
int main() {
  char mark = 'B';
  std::cout << mark << "\n";
  return 0;
}
```

输出里能看到 `B`。
