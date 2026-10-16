---
language: cpp
chapter: 37
title: "C++ Preprocessor"
level: beginner
minutes: 8
goals:
  - "Name a number with define"
  - "Drop a region with #if 0"
  - "Block a second definition with ifndef"
sources:
  - learncpp
updated: "2026-10-16"
---

Preprocessing happens before compilation. The samples still check the result with `cout`, after the preprocessor has finished its replacements.

### A macro

`RATE` is replaced by 2 before the compiler sees the expression. Nine times that replacement is 18.

```cpp run expect="18" title="Replaced by 2"
#include <iostream>
#define RATE 2
int main() {
  std::cout << (9 * RATE) << "\n";
  return 0;
}
```

After preprocessing, the line is `18`.

### Drop a region

Text inside `#if 0` is discarded. The hidden greeting never reaches the compiler, and `kept` does.

```cpp run expect="kept" title="Conditional compilation"
#include <iostream>
int main() {
#if 0
  std::cout << "hidden\n";
#endif
  std::cout << "kept\n";
  return 0;
}
```

After preprocessing, the line is `kept`.

### Define it once

An include guard can also block a second definition inside this single file. `kRate` is 2, and the product is 18.

```cpp run expect="18" title="Guard"
#include <iostream>
#ifndef RATE_H
#define RATE_H
const int kRate = 2;
#endif
int main() {
  std::cout << (9 * kRate) << "\n";
  return 0;
}
```

After preprocessing, the line is `18`.
