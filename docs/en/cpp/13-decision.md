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

`stock` is 0, so the true branch runs. The message is the out-of-stock line, `缺货`.

```cpp run expect="缺货" title="No stock"
#include <iostream>
int main() {
  int stock = 0;
  if (stock == 0) std::cout << "缺货\n";
  else std::cout << "有货\n";
  return 0;
}
```

The chosen text is `缺货`.

### switch

Each arm ends with `break`, so control does not fall into the next arm. `code` is 2, which selects `乙`.

```cpp run expect="乙" title="Second branch"
#include <iostream>
int main() {
  int code = 2;
  switch (code) {
    case 1: std::cout << "甲\n"; break;
    case 2: std::cout << "乙\n"; break;
    default: std::cout << "其他\n"; break;
  }
  return 0;
}
```

The chosen text is `乙`.

### Zero in a condition

A condition treats 0 as false. The ternary operator therefore picks the second string, `无`.

```cpp run expect="无" title="Zero is false"
#include <iostream>
int main() {
  int n = 0;
  std::cout << (n ? "有" : "无") << "\n";
  return 0;
}
```

The chosen text is `无`.
