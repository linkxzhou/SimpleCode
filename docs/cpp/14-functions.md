---
language: cpp
chapter: 14
title: "C++ 函数"
level: beginner
minutes: 8
goals:
  - "写出带返回值的函数"
  - "用引用修改调用方"
  - "给参数一个默认值"
sources:
  - learncpp
updated: "2026-10-15"
---

函数把一段计算收成名字。引用参数改的是调用方的变量。

### 返回值

`add` 把两个参数加起来交回去。

```cpp run expect="18" title="相加"
#include <iostream>
int add(int a, int b) { return a + b; }
int main() {
  std::cout << add(11, 7) << "\n";
  return 0;
}
```

输出里能看到 `18`。

### 引用参数

`bump` 改的是 `main` 里的 `n`。

```cpp run expect="11" title="加一"
#include <iostream>
void bump(int &n) { n += 1; }
int main() {
  int n = 10;
  bump(n);
  std::cout << n << "\n";
  return 0;
}
```

输出里能看到 `11`。

### 默认参数

省略第二个参数时，按 1 来加。

```cpp run expect="18" title="省略一个"
#include <iostream>
int add(int a, int b = 1) { return a + b; }
int main() {
  std::cout << add(17) << "\n";
  return 0;
}
```

输出里能看到 `18`。
