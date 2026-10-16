---
language: cpp
chapter: 10
title: "C++ Storage Classes"
level: beginner
minutes: 8
goals:
  - "Remember the previous value with static"
  - "Declare a variable defined elsewhere with extern"
  - "Count inside a const method with mutable"
sources:
  - learncpp
updated: "2026-10-16"
---

A storage class says how long a name lives and where it resides. `register` is no longer used. In this dialect `auto` means type deduction, which the environment chapter already covered.

### static inside a function

A function-local `static` keeps its value across calls. Each call adds one, so the second call returns 2.

```cpp run expect="2" title="Second call"
#include <iostream>
int next_id() {
  static int n = 0;
  n += 1;
  return n;
}
int main() {
  next_id();
  std::cout << next_id() << "\n";
  return 0;
}
```

The second call prints `2`.

### extern

`extern` only declares the name. The definition comes later, and it still belongs to this same file.

```cpp run expect="18" title="Definition in the same file"
#include <iostream>
extern int price;
int price = 18;
int main() {
  std::cout << price << "\n";
  return 0;
}
```

The defined `price` prints as `18`.

### mutable

A const method may not change an ordinary member. It may change a `mutable` counter. Two reads leave `reads` at 2 while `value` stays 7.

```cpp run expect="7 2" title="Read twice"
#include <iostream>
struct Meter {
  mutable int reads;
  int value;
  int get() const {
    reads += 1;
    return value;
  }
};
int main() {
  Meter meter{0, 7};
  meter.get();
  std::cout << meter.get() << " " << meter.reads << "\n";
  return 0;
}
```

Value and read count print as `7 2`.
