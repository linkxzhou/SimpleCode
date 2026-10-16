---
language: cpp
chapter: 28
title: "C++ Polymorphism"
level: beginner
minutes: 8
goals:
  - "Call the real type through a virtual function"
  - "Delete the object through a base pointer"
  - "Give the base class a virtual destructor"
sources:
  - learncpp
updated: "2026-10-16"
---

A virtual call reaches the derived version only when you call through a base pointer or a base reference. A call on a base object itself stays with the base.

### A virtual function

The static type of the pointer is `Tag`, and the real object is a `PenTag`. `id` therefore returns 2. The base destructor is virtual so `delete` through that pointer is safe.

```cpp run expect="2" title="Derived version"
#include <iostream>
struct Tag {
  virtual int id() const { return 1; }
  virtual ~Tag() {}
};
struct PenTag : Tag {
  int id() const override { return 2; }
};
int main() {
  Tag *p = new PenTag();
  std::cout << p->id() << "\n";
  delete p;
  return 0;
}
```

The dynamic call prints `2`.

### The base version

When the object really is a `Tag`, `id` returns the base value 1. No derived object is involved.

```cpp run expect="1" title="Base version"
#include <iostream>
struct Tag {
  virtual int id() const { return 1; }
  virtual ~Tag() {}
};
int main() {
  Tag tag;
  std::cout << tag.id() << "\n";
  return 0;
}
```

Calling `id` on that `Tag` prints `1`.

### A reference can dispatch too

The parameter is a `const Tag &`, and the argument is a `PenTag`. The call inside `show` still selects the derived `id`, which is 2.

```cpp run expect="2" title="Dispatch through a reference"
#include <iostream>
struct Tag {
  virtual int id() const { return 1; }
  virtual ~Tag() {}
};
struct PenTag : Tag {
  int id() const override { return 2; }
};
int show(const Tag &tag) { return tag.id(); }
int main() {
  PenTag pen;
  std::cout << show(pen) << "\n";
  return 0;
}
```

The dynamic call prints `2`.
