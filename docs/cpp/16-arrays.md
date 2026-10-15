---
language: cpp
chapter: 16
title: "C++ 数组"
level: beginner
minutes: 8
goals:
  - "用下标读取"
  - "用 sizeof 计算元素个数"
  - "知道数组下标从 0 开始"
sources:
  - learncpp
updated: "2026-10-15"
---

内建数组的长度写在声明里。

### 下标

第二项的下标是 1，值是 8。

```cpp run expect="8" title="第二项"
#include <iostream>
int main() {
  int a[3] = {2, 8, 5};
  std::cout << a[1] << "\n";
  return 0;
}
```

输出里能看到 `8`。

### 元素个数

`sizeof` 相除得到的是项数，不是字节。

```cpp run expect="3" title="三项"
#include <iostream>
int main() {
  int a[3] = {2, 8, 5};
  std::cout << (sizeof a / sizeof a[0]) << "\n";
  return 0;
}
```

输出里能看到 `3`。

### 第一项

下标 0 是 2，不是 8。

```cpp run expect="2" title="第一项"
#include <iostream>
int main() {
  int a[3] = {2, 8, 5};
  std::cout << a[0] << "\n";
  return 0;
}
```

输出里能看到 `2`。
