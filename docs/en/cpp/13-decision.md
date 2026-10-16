---
language: cpp
chapter: 13
title: "C++ Decision"
level: beginner
minutes: 8
goals:
  - "Choose one path with if"
  - "Branch on an integer with switch"
  - "Treat 0 as false in a condition"
sources:
  - learncpp
updated: "2026-10-16"
---

A decision selects which statements actually run. The other branch is compiled, but it stays idle for this input.

### if

`stock` is 0, so the true branch runs. The message is the out-of-stock line, `soldout`.

```cpp run expect="soldout" title="No stock"
#include <iostream>
int main() {
  int stock = 0;
  if (stock == 0) std::cout << "soldout\n";
  else std::cout << "instock\n";
  return 0;
}
```

The chosen text is `soldout`.

### switch

Each arm ends with `break`, so control does not fall into the next arm. `code` is 2, which selects `second`.

```cpp run expect="second" title="Second branch"
#include <iostream>
int main() {
  int code = 2;
  switch (code) {
    case 1: std::cout << "first\n"; break;
    case 2: std::cout << "second\n"; break;
    default: std::cout << "other\n"; break;
  }
  return 0;
}
```

The chosen text is `second`.

### Zero in a condition

A condition treats 0 as false. The ternary operator therefore picks the second string, `none`.

```cpp run expect="none" title="Zero is false"
#include <iostream>
int main() {
  int n = 0;
  std::cout << (n ? "has" : "none") << "\n";
  return 0;
}
```

The chosen text is `none`.
