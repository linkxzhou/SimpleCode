---
language: cpp
chapter: 19
title: "C++ References"
level: beginner
minutes: 8
goals:
  - "Bind a reference to an existing variable"
  - "Change the original value through the reference"
  - "Refuse a reference declared with no object"
sources:
  - learncpp
updated: "2026-10-16"
---

A reference is another name for an object. It must be bound at the declaration. There is no later step that attaches it.

### Binding

Assigning to the reference assigns to the original `n`. After `r = 8`, `n` itself is 8.

```cpp run expect="8" title="The same object"
#include <iostream>
int main() {
  int n = 3;
  int &r = n;
  r = 8;
  std::cout << n << "\n";
  return 0;
}
```

The bound variable prints `8`.

### A function parameter

A reference parameter lets the function update the caller without a pointer. `set_price` writes 18 into `price`.

```cpp run expect="18" title="Write back"
#include <iostream>
void set_price(int &price) { price = 18; }
int main() {
  int price = 0;
  set_price(price);
  std::cout << price << "\n";
  return 0;
}
```

The bound variable prints `18`.

### It cannot stand alone

A reference with no object fails to compile. This fragment is here to read, and the page does not run it.

```cpp norun title="No object"
int main() {
  int &r;
  return 0;
}
```
