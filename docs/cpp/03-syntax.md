---
language: cpp
chapter: 3
title: "C++ 基本语法"
level: beginner
minutes: 8
goals:
  - "用分号结束语句"
  - "用花括号包住一块"
  - "用 << 把数据送进输出流"
sources:
  - learncpp
updated: "2026-10-15"
---

语句以分号结束。花括号决定一块代码从哪到哪。

### 分号

两条输出各写一行。

```cpp run expect="甲" title="第一行"
#include <iostream>
int main() {
  std::cout << "甲\n";
  std::cout << "乙\n";
  return 0;
}
```

输出里能看到 `甲`。

### 块

块里声明的名字只在块内使用。

```cpp run expect="2" title="先是块内"
#include <iostream>
int main() {
  int outer = 1;
  {
    int inner = 2;
    std::cout << inner << "\n";
  }
  std::cout << outer << "\n";
  return 0;
}
```

输出里能看到 `2`。

### 输出运算符

`<<` 可以连着写，中间不会自动加空格。

```cpp run expect="茶18" title="连在一起"
#include <iostream>
int main() {
  std::cout << "茶" << 18 << "\n";
  return 0;
}
```

输出里能看到 `茶18`。
