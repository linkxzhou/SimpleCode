---
language: cpp
chapter: 4
title: "C++ Comments"
level: beginner
minutes: 8
goals:
  - "Comment one line with //"
  - "Skip a region with a block comment"
  - "Expect commented-out output to stay hidden"
sources:
  - learncpp
updated: "2026-10-16"
---

A comment is for the reader. The compiler discards it before it generates code.

### A line comment

Text after `//` is not compiled. The hidden `cout` never runs, and only the following statement does.

```cpp run expect="kept" title="Line comment"
#include <iostream>
int main() {
  // std::cout << "hidden\n";
  std::cout << "kept\n";
  return 0;
}
```

What remains visible is `kept`.

### A block comment

Everything from `/*` through `*/` drops out of the translation. The two calls inside that span are skipped together.

```cpp run expect="third" title="Block comment"
#include <iostream>
int main() {
  /* std::cout << "first\n";
     std::cout << "second\n"; */
  std::cout << "third\n";
  return 0;
}
```

What remains visible is `third`.

### A note on the same line

A `//` comment may follow a statement on that same line. Here it records that 18 is the unit price, and the print still happens.

```cpp run expect="18" title="Trailing comment"
#include <iostream>
int main() {
  int price = 18; // price
  std::cout << price << "\n";
  return 0;
}
```

What remains visible is `18`.
