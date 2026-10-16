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

```cpp run expect="留下" title="Line comment"
#include <iostream>
int main() {
  // std::cout << "隐藏\n";
  std::cout << "留下\n";
  return 0;
}
```

What remains visible is `留下`.

### A block comment

Everything from `/*` through `*/` drops out of the translation. The two calls inside that span are skipped together.

```cpp run expect="丙" title="Block comment"
#include <iostream>
int main() {
  /* std::cout << "甲\n";
     std::cout << "乙\n"; */
  std::cout << "丙\n";
  return 0;
}
```

What remains visible is `丙`.

### A note on the same line

A `//` comment may follow a statement on that same line. Here it records that 18 is the unit price, and the print still happens.

```cpp run expect="18" title="Trailing comment"
#include <iostream>
int main() {
  int price = 18; // 单价
  std::cout << price << "\n";
  return 0;
}
```

What remains visible is `18`.
