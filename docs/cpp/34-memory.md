---
language: cpp
chapter: 34
title: "C++ 动态内存"
level: beginner
minutes: 8
goals:
  - "用 new 分配一个整数"
  - "用 delete 交还"
  - "用 new[] 和 delete[] 成对出现"
sources:
  - learncpp
updated: "2026-10-15"
---

自己分配的内存要按同样的形式交还。

### 一个整数

`new int(7)` 得到的指针要 `delete`。

```cpp run expect="7" title="一个整数"
#include <iostream>
int main() {
  int *p = new int(7);
  std::cout << *p << "\n";
  delete p;
  return 0;
}
```

输出里能看到 `7`。

### 数组

数组用 `delete[]`，不能只用 `delete`。

```cpp run expect="8" title="第二项"
#include <iostream>
int main() {
  int *p = new int[3];
  p[0] = 2;
  p[1] = 8;
  p[2] = 5;
  std::cout << p[1] << "\n";
  delete[] p;
  return 0;
}
```

输出里能看到 `8`。

### 分配后立刻赋值

先分配，再写入 18，然后释放。

```cpp run expect="18" title="写入后释放"
#include <iostream>
int main() {
  int *p = new int;
  *p = 18;
  std::cout << *p << "\n";
  delete p;
  return 0;
}
```

输出里能看到 `18`。
