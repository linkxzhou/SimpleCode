---
language: cpp
chapter: 47
title: "C++ constexpr"
level: advanced
minutes: 9
goals:
  - "Square a number in a function the compiler can evaluate"
  - "Write a loop inside a constexpr function"
  - "Use that result as an array length"
sources:
  - cppreference
updated: "2026-10-20"
---

A `constexpr` function can be evaluated at compile time when its arguments are constant expressions. C++14 allows local variables and loops in the body. The result can be an array bound. These samples do not call constexpr operations on `std::array`, which depends on the library version.

### Square of six

`sq(6)` is 36. The call sits in the output statement and the argument is a literal, so the compiler may fold it.

```cpp run expect="36" title="Square"
#include <iostream>
constexpr int sq(int x) { return x * x; }
int main() {
  std::cout << sq(6) << "\n";
  return 0;
}
```

36 is the square of 6.

### A loop that adds

`tri(4)` adds the integers from 1 through 4 and returns 10. The loop is inside the `constexpr` function, which C++14 allows.

```cpp run expect="10" title="Sum from 1 to 4"
#include <iostream>
constexpr int tri(int n) {
  int sum = 0;
  for (int i = 1; i <= n; i++) sum += i;
  return sum;
}
int main() {
  std::cout << tri(4) << "\n";
  return 0;
}
```

The sum is 10.

### An array bound

`sq(3)` is 9 and becomes the length of `cell`. Only cell 0 is written, so no uninitialized cell is read.

```cpp run expect="9" title="Length from constexpr"
#include <iostream>
constexpr int sq(int x) { return x * x; }
int main() {
  constexpr int n = sq(3);
  int cell[n];
  cell[0] = n;
  std::cout << cell[0] << "\n";
  return 0;
}
```

Cell 0 holds 9.

### Exercise: add two numbers

`add(2, 5)` is 7 at compile time. The body is a single return, shorter than the loop, under the same rule.

```cpp run expect="7" title="2+5"
#include <iostream>
constexpr int add(int a, int b) { return a + b; }
int main() {
  std::cout << add(2, 5) << "\n";
  return 0;
}
```

Two plus five is 7.
