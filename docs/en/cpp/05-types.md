---
language: cpp
chapter: 5
title: "C++ Data Types"
level: beginner
minutes: 8
goals:
  - "Separate int, double, char, and bool"
  - "Read a printed bool as 0 or 1"
  - "Measure storage with sizeof"
sources:
  - learncpp
updated: "2026-10-16"
---

A type decides how a region of memory is interpreted. The same bits can be an integer, a character, or a flag, depending on the declaration.

### Four common types

`bool` prints as an integer. `true` therefore shows up as 1, next to the `int`, the `double`, and the `char`.

```cpp run expect="3 1.5 A 1" title="Four types"
#include <iostream>
int main() {
  int n = 3;
  double x = 1.5;
  char c = 'A';
  bool ok = true;
  std::cout << n << " " << x << " " << c << " " << ok << "\n";
  return 0;
}
```

The line reads `3 1.5 A 1`.

### Integer division

When both operands are `int`, the quotient is an `int`. The fractional part of `7 / 2` is discarded, leaving 3.

```cpp run expect="3" title="Drop the fraction"
#include <iostream>
int main() {
  std::cout << (7 / 2) << "\n";
  return 0;
}
```

The line reads `3`.

### A count of bytes

`sizeof` reports bytes occupied, not a count of elements. On this target an `int` occupies 4 bytes.

```cpp run expect="4" title="Width of int"
#include <iostream>
int main() {
  std::cout << sizeof(int) << "\n";
  return 0;
}
```

The line reads `4`.
