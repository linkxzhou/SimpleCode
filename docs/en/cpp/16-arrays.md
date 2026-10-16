---
language: cpp
chapter: 16
title: "C++ Arrays"
level: beginner
minutes: 8
goals:
  - "Read an element by index"
  - "Count elements by dividing sizeof"
  - "Remember that indexes start at 0"
sources:
  - learncpp
updated: "2026-10-16"
---

A built-in array has its length written in the declaration. The three samples below all use `{2, 8, 5}` and look at a different fact about that array.

### An index

Indexes begin at 0, so the second element is `a[1]`. That element holds 8.

```cpp run expect="8" title="Second element"
#include <iostream>
int main() {
  int a[3] = {2, 8, 5};
  std::cout << a[1] << "\n";
  return 0;
}
```

Element access prints `8`.

### How many elements

Dividing `sizeof a` by `sizeof a[0]` counts elements. The result is the item count 3, not a byte count.

```cpp run expect="3" title="Three elements"
#include <iostream>
int main() {
  int a[3] = {2, 8, 5};
  std::cout << (sizeof a / sizeof a[0]) << "\n";
  return 0;
}
```

The element count is `3`.

### The first element

Index 0 holds 2. It does not hold the 8 that sits in the next slot.

```cpp run expect="2" title="First element"
#include <iostream>
int main() {
  int a[3] = {2, 8, 5};
  std::cout << a[0] << "\n";
  return 0;
}
```

Index zero prints `2`.
