---
language: cpp
chapter: 7
title: "C++ 变量作用域"
level: beginner
minutes: 8
goals:
  - "看出块内的同名变量挡住外面"
  - "知道参数只在函数里"
  - "出了块仍能使用外层"
sources:
  - learncpp
updated: "2026-10-15"
---

名字从声明处开始，到所在块结束。

### 块内遮蔽

内层的 `n` 是 2。块结束后，外层的 `n` 仍是 1。

```cpp run expect="2" title="先是内层"
#include <iostream>
int main() {
  int n = 1;
  {
    int n = 2;
    std::cout << n << "\n";
  }
  std::cout << n << "\n";
  return 0;
}
```

输出里能看到 `2`。

### 参数

参数 `n` 只活在 `twice` 里。

```cpp run expect="8" title="参数"
#include <iostream>
int twice(int n) { return n * 2; }
int main() {
  std::cout << twice(4) << "\n";
  return 0;
}
```

输出里能看到 `8`。

### 出了块用外层

内层只读外层的 `n`，并把它加上 2。

```cpp run expect="3" title="外层被加上"
#include <iostream>
int main() {
  int n = 1;
  {
    int extra = 2;
    n = n + extra;
  }
  std::cout << n << "\n";
  return 0;
}
```

输出里能看到 `3`。
