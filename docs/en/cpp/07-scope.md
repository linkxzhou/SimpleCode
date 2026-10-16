---
language: cpp
chapter: 7
title: "C++ Variable Scope"
level: beginner
minutes: 8
goals:
  - "See an inner name hide the outer one"
  - "Treat a parameter as local to its function"
  - "Keep using the outer name after the block"
sources:
  - learncpp
updated: "2026-10-16"
---

A name starts at its declaration and ends at the close of the block that contains it. An inner declaration can hide an outer one for that span only.

### Hiding inside a block

The inner `n` is 2, so the first print shows 2. After the braces, the outer `n` is still 1.

```cpp run expect="2" title="Inner name first"
#include <iostream>
int main() {
  int n = 1;
  {
    int n = 2;
    std::cout << n << "\n";
  }
  std::cout << n << "\n";
  return 0;
}
```

The opening number is `2`.

### The argument stays local

`twice` binds its argument to `n` and drops that name on return. Passing 4 makes the returned product 8.

```cpp run expect="8" title="Parameter"
#include <iostream>
int twice(int n) { return n * 2; }
int main() {
  std::cout << twice(4) << "\n";
  return 0;
}
```

The opening number is `8`.

### The outer name after the block

The inner block does not declare its own `n`. It reads the outer one and adds `extra`, so `n` becomes 3.

```cpp run expect="3" title="Outer name updated"
#include <iostream>
int main() {
  int n = 1;
  {
    int extra = 2;
    n = n + extra;
  }
  std::cout << n << "\n";
  return 0;
}
```

The opening number is `3`.
