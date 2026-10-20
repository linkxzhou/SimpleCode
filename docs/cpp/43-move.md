---
language: cpp
chapter: 43
title: "C++ 移动"
level: advanced
minutes: 10
goals:
  - "写一个把资源交出去的移动构造"
  - "移动后源对象不再持有原值"
  - "用 swap 交换两个 int"
sources:
  - cppreference
  - modern-cpp-features
updated: "2026-10-20"
---

移动构造从源对象拿走资源，并让源对象处于可销毁的空状态。这里用一个整数代替堆块：移走后源对象的字段写成 0。复制构造被 `= delete`，强迫调用方使用移动。`std::swap` 对 `int` 不需要自己写移动。

### 移走字段

`Box` 的移动构造把 `n` 抄走，再把源对象改成 0。`a` 一开始是 4。移动到 `b` 之后，`b.n` 是 4，`a.n` 是 0，连起来打印 `40`。

```cpp run expect="40" title="移走后源为 0"
#include <iostream>
#include <utility>
struct Box {
  int n;
  Box(int value) : n(value) {}
  Box(Box &&other) : n(other.n) { other.n = 0; }
  Box(const Box &) = delete;
};
int main() {
  Box source(4);
  Box kept(std::move(source));
  std::cout << kept.n << source.n << "\n";
  return 0;
}
```

输出 `40`。

### 另一个起点

同样的类型，起点改成 7。移动后应打印 `70`。复制仍然被删掉，所以不能写成 `Box kept = source`。

```cpp run expect="70" title="从 7 移走"
#include <iostream>
#include <utility>
struct Box {
  int n;
  Box(int value) : n(value) {}
  Box(Box &&other) : n(other.n) { other.n = 0; }
  Box(const Box &) = delete;
};
int main() {
  Box source(7);
  Box kept(std::move(source));
  std::cout << kept.n << source.n << "\n";
  return 0;
}
```

输出 `70`。

### 交换两个整数

`std::swap` 把 2 和 9 对调。打印交换后的第一个变量，得到 9。这不是移动构造，只是标准库里现成的交换。

```cpp run expect="9" title="对调之后"
#include <iostream>
#include <utility>
int main() {
  int left = 2;
  int right = 9;
  std::swap(left, right);
  std::cout << left << "\n";
  return 0;
}
```

原来的 2 变成 9。

### 练习：移动 unique_ptr

第 41 章的所有权移动也是移动。这里再写一次，起点是 5。移动后新指针里是 5，旧指针为空，打印 `50`。

```cpp run expect="50" title="指针也被移走"
#include <iostream>
#include <memory>
#include <utility>
int main() {
  std::unique_ptr<int> source(new int(5));
  std::unique_ptr<int> kept(std::move(source));
  std::cout << *kept << (source ? 1 : 0) << "\n";
  return 0;
}
```

输出 `50`。
