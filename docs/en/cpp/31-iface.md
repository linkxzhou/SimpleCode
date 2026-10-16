---
language: cpp
chapter: 31
title: "C++ Interfaces"
level: beginner
minutes: 8
goals:
  - "Represent an interface with an abstract class"
  - "Implement both methods in the derived class"
  - "Call through a base reference"
sources:
  - learncpp
updated: "2026-10-16"
---

The abstract class in this chapter has two pure virtual functions. A derived class has to implement both before an object of that class can be created.

### Two methods

`Pen` supplies both `name` and `price`. The printed pair is the word `笔` and the number 18.

```cpp run expect="笔 18" title="Both members"
#include <iostream>
#include <string>
struct Goods {
  virtual std::string name() const = 0;
  virtual int price() const = 0;
  virtual ~Goods() {}
};
struct Pen : Goods {
  std::string name() const override { return "笔"; }
  int price() const override { return 18; }
};
int main() {
  Pen pen;
  std::cout << pen.name() << " " << pen.price() << "\n";
  return 0;
}
```

The goods line is `笔 18`.

### Call through the interface

`ask` accepts only `const Goods &`. It asks for the price and ignores the name, so the result is 18.

```cpp run expect="18" title="Ask only for the price"
#include <iostream>
#include <string>
struct Goods {
  virtual std::string name() const = 0;
  virtual int price() const = 0;
  virtual ~Goods() {}
};
struct Pen : Goods {
  std::string name() const override { return "笔"; }
  int price() const override { return 18; }
};
int ask(const Goods &goods) { return goods.price(); }
int main() {
  Pen pen;
  std::cout << ask(pen) << "\n";
  return 0;
}
```

The goods line is `18`.

### Another implementation

`Ink` is also a `Goods`, with a different price. This sample prints only the name, which is `墨`.

```cpp run expect="墨" title="Another product"
#include <iostream>
#include <string>
struct Goods {
  virtual std::string name() const = 0;
  virtual int price() const = 0;
  virtual ~Goods() {}
};
struct Ink : Goods {
  std::string name() const override { return "墨"; }
  int price() const override { return 7; }
};
int main() {
  Ink ink;
  std::cout << ink.name() << "\n";
  return 0;
}
```

The goods line is `墨`.
