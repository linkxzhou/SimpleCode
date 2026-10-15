---
language: cpp
chapter: 5
title: "C++ 数据类型"
level: beginner
minutes: 8
goals:
  - "区分 int、double、char 和 bool"
  - "知道 bool 打印出来是 0 或 1"
  - "用 sizeof 看占用的字节"
sources:
  - learncpp
updated: "2026-10-15"
---

类型决定一块内存怎样解释。

### 四种常见类型

布尔值按整数打印，`true` 是 1。

```cpp run expect="3 1.5 A 1" title="四种"
#include <iostream>
int main() {
  int n = 3;
  double x = 1.5;
  char c = 'A';
  bool ok = true;
  std::cout << n << " " << x << " " << c << " " << ok << "\n";
  return 0;
}
```

输出里能看到 `3 1.5 A 1`。

### 整数相除

两个 `int` 相除会丢掉小数。

```cpp run expect="3" title="丢掉小数"
#include <iostream>
int main() {
  std::cout << (7 / 2) << "\n";
  return 0;
}
```

输出里能看到 `3`。

### 字节数

`sizeof` 的结果是字节，不是元素个数。

```cpp run expect="4" title="int 的宽度"
#include <iostream>
int main() {
  std::cout << sizeof(int) << "\n";
  return 0;
}
```

输出里能看到 `4`。
