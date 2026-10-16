---
language: cpp
chapter: 36
title: "C++ Templates"
level: beginner
minutes: 8
goals:
  - "Compare two values with a function template"
  - "Store one type in a class template"
  - "Name the type at the call"
sources:
  - learncpp
updated: "2026-10-16"
---

A template picks its type when it is used. Every sample here uses `int` and no other type argument.

### A function template

`smaller` returns whichever of the two arguments is less. Between 8 and 3, the result is 3.

```cpp run expect="3" title="The smaller one"
#include <iostream>
template <typename T>
T smaller(T a, T b) { return a < b ? a : b; }
int main() {
  std::cout << smaller(8, 3) << "\n";
  return 0;
}
```

The template result is `3`.

### A class template

`Box<int>` holds a single integer. The member `value` is set to 18.

```cpp run expect="18" title="Hold one integer"
#include <iostream>
template <typename T>
struct Box { T value; };
int main() {
  Box<int> box{18};
  std::cout << box.value << "\n";
  return 0;
}
```

The template result is `18`.

### An explicit type argument

Writing `<int>` at the call states the type. The function does not have to deduce it from the argument.

```cpp run expect="18" title="Spell out int"
#include <iostream>
template <typename T>
T pick(T a) { return a; }
int main() {
  std::cout << pick<int>(18) << "\n";
  return 0;
}
```

The template result is `18`.
