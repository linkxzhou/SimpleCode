---
language: cpp
chapter: 43
title: "C++ move"
level: advanced
minutes: 10
goals:
  - "Write a move constructor that gives a field away"
  - "Leave the source without the old value"
  - "Swap two ints with std::swap"
sources:
  - cppreference
  - modern-cpp-features
updated: "2026-10-20"
---

A move constructor takes a resource from the source and leaves the source in a state that can be destroyed. An integer stands in for a heap block: after the move the source field is 0. The copy constructor is `= delete`, so callers must move. `std::swap` on `int` does not need a handwritten move.

### Move the field

The move constructor of `Box` copies `n` and then stores 0 in the source. `source` starts at 4. After the move into `kept`, `kept.n` is 4 and `source.n` is 0. Printed together that is `40`.

```cpp run expect="40" title="Source becomes 0"
#include <iostream>
#include <utility>
struct Box {
  int n;
  Box(int value) : n(value) {}
  Box(Box &&other) : n(other.n) { other.n = 0; }
  Box(const Box &) = delete;
};
int main() {
  Box source(4);
  Box kept(std::move(source));
  std::cout << kept.n << source.n << "\n";
  return 0;
}
```

The line is `40`.

### A different starting value

The same type starts at 7. After the move the line should be `70`. Copying is still deleted, so `Box kept = source` would not compile.

```cpp run expect="70" title="Moved from 7"
#include <iostream>
#include <utility>
struct Box {
  int n;
  Box(int value) : n(value) {}
  Box(Box &&other) : n(other.n) { other.n = 0; }
  Box(const Box &) = delete;
};
int main() {
  Box source(7);
  Box kept(std::move(source));
  std::cout << kept.n << source.n << "\n";
  return 0;
}
```

The line is `70`.

### Swap two ints

`std::swap` exchanges 2 and 9. Printing the first variable afterwards shows 9. This is not a move constructor. It is the swap already in the standard library.

```cpp run expect="9" title="After the swap"
#include <iostream>
#include <utility>
int main() {
  int left = 2;
  int right = 9;
  std::swap(left, right);
  std::cout << left << "\n";
  return 0;
}
```

The original 2 is now 9.

### Exercise: move a unique_ptr

Ownership transfer from chapter 41 is also a move. This listing starts at 5. After the move the new pointer holds 5 and the old one is empty, so the line is `50`.

```cpp run expect="50" title="The pointer moves too"
#include <iostream>
#include <memory>
#include <utility>
int main() {
  std::unique_ptr<int> source(new int(5));
  std::unique_ptr<int> kept(std::move(source));
  std::cout << *kept << (source ? 1 : 0) << "\n";
  return 0;
}
```

The line is `50`.
