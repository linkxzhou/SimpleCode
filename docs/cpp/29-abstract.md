---
language: cpp
chapter: 29
title: "C++ 数据抽象"
level: beginner
minutes: 8
goals:
  - "用纯虚函数留下接口"
  - "让调用方只看见面积"
  - "在派生类里给出算法"
sources:
  - learncpp
updated: "2026-10-15"
---

调用方只依赖 `area`。矩形怎样算面积，留在派生类里。

### 纯虚函数

`Shape` 不能直接创建。`Rect` 实现面积。

```cpp run expect="15" title="矩形面积"
#include <iostream>
struct Shape {
  virtual int area() const = 0;
  virtual ~Shape() {}
};
struct Rect : Shape {
  int w;
  int h;
  Rect(int width, int height) : w(width), h(height) {}
  int area() const override { return w * h; }
};
int main() {
  Rect rect(3, 5);
  std::cout << rect.area() << "\n";
  return 0;
}
```

输出里能看到 `15`。

### 只看接口

函数参数是 `const Shape &`，它读不到 `w` 和 `h`。

```cpp run expect="8" title="交给接口"
#include <iostream>
struct Shape {
  virtual int area() const = 0;
  virtual ~Shape() {}
};
struct Rect : Shape {
  int w;
  int h;
  Rect(int width, int height) : w(width), h(height) {}
  int area() const override { return w * h; }
};
int report(const Shape &shape) { return shape.area(); }
int main() {
  Rect rect(4, 2);
  std::cout << report(rect) << "\n";
  return 0;
}
```

输出里能看到 `8`。

### 另一种形状

正方形只用一条边。调用方式仍是 `area`。

```cpp run expect="16" title="正方形"
#include <iostream>
struct Shape {
  virtual int area() const = 0;
  virtual ~Shape() {}
};
struct Square : Shape {
  int side;
  Square(int edge) : side(edge) {}
  int area() const override { return side * side; }
};
int main() {
  Square box(4);
  std::cout << box.area() << "\n";
  return 0;
}
```

输出里能看到 `16`。
