---
language: cpp
chapter: 8
title: "C++ Constants"
level: beginner
minutes: 8
goals:
  - "Freeze a variable with const"
  - "Freeze a compile-time number with constexpr"
  - "Name a series of ordinals with an enum"
sources:
  - learncpp
updated: "2026-10-16"
---

A number you do not plan to change reads more clearly as a named constant than as a bare literal. This chapter uses three ways to fix such a value.

### const

`rate` is used in the product and is never assigned again. Multiplying 9 by that constant yields 18.

```cpp run expect="18" title="Rate"
#include <iostream>
int main() {
  const int rate = 2;
  std::cout << (9 * rate) << "\n";
  return 0;
}
```

The result line is `18`.

### constexpr

`base` can be fixed while the program is compiled. Adding 8 to that base prints 18.

```cpp run expect="18" title="Base"
#include <iostream>
int main() {
  constexpr int base = 10;
  std::cout << (base + 8) << "\n";
  return 0;
}
```

The result line is `18`.

### An enumeration

Enumerators are numbered from 0. `Green` is the second name, so its value is 1.

```cpp run expect="1" title="Second enumerator"
#include <iostream>
enum Color { Red, Green, Blue };
int main() {
  std::cout << Green << "\n";
  return 0;
}
```

The result line is `1`.
