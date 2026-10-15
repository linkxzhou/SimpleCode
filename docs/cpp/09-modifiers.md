---
language: cpp
chapter: 9
title: "C++ 修饰符类型"
level: beginner
minutes: 8
goals:
  - "区分 short、long 和 int"
  - "用 unsigned 表示不会是负数的数"
  - "知道 long long 能放下更大的整数"
sources:
  - learncpp
updated: "2026-10-15"
---

修饰符改变整数的宽度或是否带符号。下面用输出核对数值，不比较它们的字节。

### 短整数和长整数

`short` 和 `long` 这里都只是拿来保存小整数。

```cpp run expect="4 5" title="两种宽度"
#include <iostream>
int main() {
  short small = 4;
  long wide = 5;
  std::cout << small << " " << wide << "\n";
  return 0;
}
```

输出里能看到 `4 5`。

### 无符号

`unsigned` 的 3 打印出来仍是 3。

```cpp run expect="3" title="计数"
#include <iostream>
int main() {
  unsigned int count = 3;
  std::cout << count << "\n";
  return 0;
}
```

输出里能看到 `3`。

### 更宽的整数

`long long` 可以写下超过 32 位的值。这里只用一个小的。

```cpp run expect="18" title="宽整数"
#include <iostream>
int main() {
  long long big = 18;
  std::cout << big << "\n";
  return 0;
}
```

输出里能看到 `18`。
