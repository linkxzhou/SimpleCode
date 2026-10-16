---
language: cpp
chapter: 18
title: "C++ Pointers"
level: beginner
minutes: 8
goals:
  - "Take an address with &"
  - "Read the pointee with *"
  - "Update the original variable through the pointer"
sources:
  - learncpp
updated: "2026-10-16"
---

A pointer stores an address. Do not dereference it unless it points at an object. A pointer with no target is written `nullptr`.

### Read the integer

Take the address of `n`, then use `*` to read the value stored there. The value is 9.

```cpp run expect="9" title="Points at 9"
#include <iostream>
int main() {
  int n = 9;
  int *p = &n;
  std::cout << *p << "\n";
  return 0;
}
```

Dereferencing prints `9`.

### Write back to the variable

`*p = 8` stores 8 in the memory of `n`. Printing `n` afterward shows that new value.

```cpp run expect="8" title="Change to 8"
#include <iostream>
int main() {
  int n = 3;
  int *p = &n;
  *p = 8;
  std::cout << n << "\n";
  return 0;
}
```

Printing `n` shows `8`.

### A null pointer

`nullptr` does not point at an object. The comparison with `nullptr` is true, so the conditional prints 0.

```cpp run expect="0" title="It is null"
#include <iostream>
int main() {
  int *p = nullptr;
  std::cout << (p == nullptr ? 0 : 1) << "\n";
  return 0;
}
```

The null test prints `0`.
