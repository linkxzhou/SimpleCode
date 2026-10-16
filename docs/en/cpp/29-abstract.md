---
language: cpp
chapter: 29
title: "C++ Data Abstraction"
level: beginner
minutes: 8
goals:
  - "Leave an interface as a pure virtual function"
  - "Show the caller only the area"
  - "Put the formula in the derived class"
sources:
  - learncpp
updated: "2026-10-16"
---

The caller depends only on `area`. How a rectangle computes that area stays inside the derived class.

### A pure virtual function

`Shape` cannot be created on its own, because `area` is pure. `Rect` supplies the formula `w * h`, and a 3 by 5 rectangle has area 15.

```cpp run expect="15" title="Rectangle area"
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

The area is `15`.

### Only the interface

The parameter type is `const Shape &`. That function cannot name `w` or `h`. It can call `area`, which for this rectangle is 8.

```cpp run expect="8" title="Through the interface"
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

The area is `8`.

### Another shape

A square needs only one side. The call is still `area`. A side of 4 gives 16.

```cpp run expect="16" title="Square"
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

The area is `16`.
