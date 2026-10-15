---
language: cpp
chapter: 1
title: "C++ 简介"
level: beginner
minutes: 8
goals:
  - "用标准库字符串保存文字"
  - "用 vector 保存一列整数"
  - "接受这里没有第二个源文件"
sources:
  - learncpp
updated: "2026-10-15"
---

C++ 在这一本里多出来的是标准库类型，不是另一套编译器。

### 字符串

`std::string` 记住字符，并知道自己的长度。

```cpp run expect="笔" title="一件物品"
#include <iostream>
#include <string>
int main() {
  std::string item = "笔";
  std::cout << item << "\n";
  return 0;
}
```

输出里能看到 `笔`。

### 一列整数

`std::vector` 的长度会随 `push_back` 增加。

```cpp run expect="1" title="一个价格"
#include <iostream>
#include <vector>
int main() {
  std::vector<int> prices;
  prices.push_back(18);
  std::cout << prices.size() << "\n";
  return 0;
}
```

输出里能看到 `1`。

### 仍是单文件

辅助函数写在 `main` 上面。没有第二个 `.cpp` 可以链接。

```cpp run expect="18" title="同一文件"
#include <iostream>
int twice(int n) { return n * 2; }
int main() {
  std::cout << twice(9) << "\n";
  return 0;
}
```

输出里能看到 `18`。
