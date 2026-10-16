---
language: cpp
chapter: 11
title: "C++ Operators"
level: beginner
minutes: 8
goals:
  - "Compute an integer quotient and remainder"
  - "Test equality with =="
  - "Combine two conditions with &&"
sources:
  - learncpp
updated: "2026-10-16"
---

This chapter checks three operator results and then stops. One sample divides, one compares, and one joins two conditions.

### Division and remainder

Dividing 7 by 2 yields a quotient of 3. The matching remainder, from `%`, is 1.

```cpp run expect="3 1" title="Quotient and remainder"
#include <iostream>
int main() {
  std::cout << (7 / 2) << " " << (7 % 2) << "\n";
  return 0;
}
```

Quotient and remainder print as `3 1`.

### Equality

`==` compares values. Equal operands print 1, and unequal operands print 0.

```cpp run expect="1 0" title="Equal or not"
#include <iostream>
int main() {
  std::cout << (3 == 3) << " " << (3 == 4) << "\n";
  return 0;
}
```

The two comparisons print `1 0`.

### And

`&&` is 1 only when both sides are true. 18 is greater than 10 and less than 20, so the combined test passes.

```cpp run expect="1" title="Both true"
#include <iostream>
int main() {
  int price = 18;
  std::cout << (price > 10 && price < 20) << "\n";
  return 0;
}
```

The combined test prints `1`.
