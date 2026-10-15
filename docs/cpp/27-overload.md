---
language: cpp
chapter: 27
title: "C++ 重载"
level: beginner
minutes: 8
goals:
  - "让同名函数按参数个数区分"
  - "写出一个相加的运算符"
  - "知道返回类型不能单独区分重载"
sources:
  - learncpp
updated: "2026-10-15"
---

重载看参数，不看返回类型。

### 参数个数

一个参数返回它自己，两个参数返回和。

```cpp run expect="3 7" title="两种调用"
#include <iostream>
int span(int w) { return w; }
int span(int w, int h) { return w + h; }
int main() {
  std::cout << span(3) << " " << span(3, 4) << "\n";
  return 0;
}
```

输出里能看到 `3 7`。

### 运算符

`operator+` 让两个 `Pair` 按字段相加。

```cpp run expect="4 6" title="字段相加"
#include <iostream>
struct Pair { int a; int b; };
Pair operator+(Pair x, Pair y) {
  Pair z;
  z.a = x.a + y.a;
  z.b = x.b + y.b;
  return z;
}
int main() {
  Pair left{1, 2};
  Pair right{3, 4};
  Pair sum = left + right;
  std::cout << sum.a << " " << sum.b << "\n";
  return 0;
}
```

输出里能看到 `4 6`。

### 调用时写清楚

两个整数参数走第二个 `area`。

```cpp run expect="15" title="矩形"
#include <iostream>
int area(int w) { return w * w; }
int area(int w, int h) { return w * h; }
int main() {
  std::cout << area(3, 5) << "\n";
  return 0;
}
```

输出里能看到 `15`。
