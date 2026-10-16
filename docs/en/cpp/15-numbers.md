---
language: cpp
chapter: 15
title: "C++ Numbers"
level: beginner
minutes: 8
goals:
  - "Separate integer division from floating division"
  - "Drop a minus sign with abs"
  - "Store 1.5 in a double"
sources:
  - learncpp
updated: "2026-10-16"
---

This chapter checks arithmetic results. It does not draw random numbers. One sample keeps a fraction, one removes a sign, and one stores a `double`.

### Floating division

If either operand is a floating value, the quotient keeps the fraction. `7 / 2.0` is 3.5.

```cpp run expect="3.5" title="Keep the fraction"
#include <iostream>
int main() {
  std::cout << (7 / 2.0) << "\n";
  return 0;
}
```

The numeric line is `3.5`.

### Absolute value

`std::abs` turns -4 into 4. The header for that function is `<cstdlib>`.

```cpp run expect="4" title="Drop the sign"
#include <cstdlib>
#include <iostream>
int main() {
  std::cout << std::abs(-4) << "\n";
  return 0;
}
```

The numeric line is `4`.

### A decimal variable

The literal `1.5` is stored in a `double` named `length`, then printed unchanged.

```cpp run expect="1.5" title="Length"
#include <iostream>
int main() {
  double length = 1.5;
  std::cout << length << "\n";
  return 0;
}
```

The numeric line is `1.5`.
