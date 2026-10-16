---
language: cpp
chapter: 3
title: "C++ Basic Syntax"
level: beginner
minutes: 8
goals:
  - "End each statement with a semicolon"
  - "Wrap a block in braces"
  - "Send values with the << operator"
sources:
  - learncpp
updated: "2026-10-16"
---

A statement ends at the semicolon. Braces mark where a block begins and where that block ends.

### Semicolons

Each output is its own statement. The two calls therefore sit on two lines, and each line closes with `;`.

```cpp run expect="first" title="First line"
#include <iostream>
int main() {
  std::cout << "first\n";
  std::cout << "second\n";
  return 0;
}
```

The first line of output is `first`.

### A block

A name declared inside the braces is used only there. `inner` is printed while the block is open, and `outer` is still available afterward.

```cpp run expect="2" title="Inner name first"
#include <iostream>
int main() {
  int outer = 1;
  {
    int inner = 2;
    std::cout << inner << "\n";
  }
  std::cout << outer << "\n";
  return 0;
}
```

The first line of output is `2`.

### The output operator

Several `<<` operators can follow one another. Nothing inserts a space unless you write one.

```cpp run expect="tea18" title="Joined together"
#include <iostream>
int main() {
  std::cout << "tea" << 18 << "\n";
  return 0;
}
```

The first line of output is `tea18`.
