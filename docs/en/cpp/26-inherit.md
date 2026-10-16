---
language: cpp
chapter: 26
title: "C++ Inheritance"
level: beginner
minutes: 8
goals:
  - "Give the derived class the base fields"
  - "Pass arguments up to the base constructor"
  - "Store an extra field on the derived class"
sources:
  - learncpp
updated: "2026-10-16"
---

A derived class reuses the reading method the base class already provides. It can also keep fields of its own.

### The base price

The price on a `Pen` comes from `Item`. The `Pen` constructor forwards 18 to `Item`, and `price()` reads it back.

```cpp run expect="18" title="Price from the base"
#include <iostream>
class Item {
 public:
  explicit Item(int price) : price_(price) {}
  int price() const { return price_; }
 private:
  int price_;
};
class Pen : public Item {
 public:
  Pen(int price, int ink) : Item(price), ink_(ink) {}
  int ink() const { return ink_; }
 private:
  int ink_;
};
int main() {
  Pen pen(18, 2);
  std::cout << pen.price() << "\n";
  return 0;
}
```

The inherited price is `18`.

### A derived field

The ink amount belongs to `Pen`. `Item` has no such field. `ink()` returns 2.

```cpp run expect="2" title="Ink"
#include <iostream>
class Item {
 public:
  explicit Item(int price) : price_(price) {}
  int price() const { return price_; }
 private:
  int price_;
};
class Pen : public Item {
 public:
  Pen(int price, int ink) : Item(price), ink_(ink) {}
  int ink() const { return ink_; }
 private:
  int ink_;
};
int main() {
  Pen pen(18, 2);
  std::cout << pen.ink() << "\n";
  return 0;
}
```

The ink amount is `2`.

### Print both

Each method reads its own field. One line shows the base price 18 and the derived ink amount 2.

```cpp run expect="18 2" title="Both values"
#include <iostream>
class Item {
 public:
  explicit Item(int price) : price_(price) {}
  int price() const { return price_; }
 private:
  int price_;
};
class Pen : public Item {
 public:
  Pen(int price, int ink) : Item(price), ink_(ink) {}
  int ink() const { return ink_; }
 private:
  int ink_;
};
int main() {
  Pen pen(18, 2);
  std::cout << pen.price() << " " << pen.ink() << "\n";
  return 0;
}
```

Price and ink print as `18 2`.
