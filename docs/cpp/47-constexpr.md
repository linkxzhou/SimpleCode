---
language: cpp
chapter: 47
title: "C++ constexpr"
level: advanced
minutes: 9
goals:
  - "写一个编译期也能算的平方"
  - "在 constexpr 函数里写循环"
  - "用编译期结果当作数组长度"
sources:
  - cppreference
updated: "2026-10-20"
---

`constexpr` 函数在参数也是常量表达式时，可以在编译期算出结果。C++14 允许函数体里有局部变量和循环。算出来的值可以当数组长度。这里不用 `std::array` 的 constexpr 操作，以免碰到库的版本限制。

### 六的平方

`sq(6)` 是 36。调用发生在输出语句里，参数是字面量，编译器可以提前算。

```cpp run expect="36" title="平方"
#include <iostream>
constexpr int sq(int x) { return x * x; }
int main() {
  std::cout << sq(6) << "\n";
  return 0;
}
```

36 是 6 的平方。

### 循环累加

`tri(4)` 把 1 到 4 相加，得到 10。循环写在 `constexpr` 函数里面，这是 C++14 才放开的写法。

```cpp run expect="10" title="1 到 4 之和"
#include <iostream>
constexpr int tri(int n) {
  int sum = 0;
  for (int i = 1; i <= n; i++) sum += i;
  return sum;
}
int main() {
  std::cout << tri(4) << "\n";
  return 0;
}
```

和是 10。

### 当作数组长度

`sq(3)` 是 9，用来声明 `cell` 的长度。只给第 0 格写入 9，避免读取未初始化的格子。

```cpp run expect="9" title="长度来自 constexpr"
#include <iostream>
constexpr int sq(int x) { return x * x; }
int main() {
  constexpr int n = sq(3);
  int cell[n];
  cell[0] = n;
  std::cout << cell[0] << "\n";
  return 0;
}
```

第 0 格是 9。

### 练习：两数相加

`add(2, 5)` 在编译期是 7。函数体只有一条返回，比循环更短，规则相同。

```cpp run expect="7" title="2+5"
#include <iostream>
constexpr int add(int a, int b) { return a + b; }
int main() {
  std::cout << add(2, 5) << "\n";
  return 0;
}
```

2 加 5 是 7。
