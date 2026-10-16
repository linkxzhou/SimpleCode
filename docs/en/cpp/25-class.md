---
language: cpp
chapter: 25
title: "C++ Classes"
level: beginner
minutes: 8
goals:
  - "Store the price in a constructor"
  - "Read it back with a const method"
  - "Keep the data in a private section"
sources:
  - learncpp
updated: "2026-10-16"
---

A class keeps data together with the methods that read it. Callers use those methods. They do not reach the private field by name.

### Construction

The constructor stores 18 in the price as the object is created. `price()` returns that stored integer.

```cpp run expect="18" title="Written in the constructor"
#include <iostream>
class Pen {
 public:
  explicit Pen(int price) : price_(price) {}
  int price() const { return price_; }
 private:
  int price_;
};
int main() {
  Pen pen(18);
  std::cout << pen.price() << "\n";
  return 0;
}
```

The method returns `18`.

### Two pens

Each object keeps its own price. `a` holds 12 and `b` holds 18, and changing one would not change the other.

```cpp run expect="12 18" title="Independent objects"
#include <iostream>
class Pen {
 public:
  explicit Pen(int price) : price_(price) {}
  int price() const { return price_; }
 private:
  int price_;
};
int main() {
  Pen a(12);
  Pen b(18);
  std::cout << a.price() << " " << b.price() << "\n";
  return 0;
}
```

The method returns `12 18`.

### A method reads the private field

Code outside the class cannot assign to `price_`. It can only call a method such as `labeled`, which returns 7.

```cpp run expect="7" title="Read only"
#include <iostream>
class Pen {
 public:
  explicit Pen(int price) : price_(price) {}
  int labeled() const { return price_; }
 private:
  int price_;
};
int main() {
  Pen pen(7);
  std::cout << pen.labeled() << "\n";
  return 0;
}
```

The method returns `7`.
