---
language: cpp
chapter: 34
title: "C++ Dynamic Memory"
level: beginner
minutes: 8
goals:
  - "Allocate one integer with new"
  - "Hand that integer back with delete"
  - "Pair new[] with delete[]"
sources:
  - learncpp
updated: "2026-10-16"
---

Memory you allocate yourself has to be released in the matching form. `delete` matches `new`, and `delete[]` matches `new[]`.

### One integer

`new int(7)` returns a pointer that must be passed to `delete` after the value is used.

```cpp run expect="7" title="One integer"
#include <iostream>
int main() {
  int *p = new int(7);
  std::cout << *p << "\n";
  delete p;
  return 0;
}
```

The allocated value is `7`.

### An array

An array from `new[]` is released with `delete[]`. A plain `delete` is the wrong form. Index 1 of this array holds 8.

```cpp run expect="8" title="Second element"
#include <iostream>
int main() {
  int *p = new int[3];
  p[0] = 2;
  p[1] = 8;
  p[2] = 5;
  std::cout << p[1] << "\n";
  delete[] p;
  return 0;
}
```

The allocated value is `8`.

### Assign right after allocation

`new int` allocates without an initial value. The next statement stores 18, the program prints it, and `delete` releases the integer.

```cpp run expect="18" title="Write, then release"
#include <iostream>
int main() {
  int *p = new int;
  *p = 18;
  std::cout << *p << "\n";
  delete p;
  return 0;
}
```

The allocated value is `18`.
