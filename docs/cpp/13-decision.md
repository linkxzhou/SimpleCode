---
language: cpp
chapter: 13
title: "C++ 判断"
level: beginner
minutes: 8
goals:
  - "用 if 选择一条路"
  - "用 switch 按整数分支"
  - "知道 0 在条件里为假"
sources:
  - learncpp
updated: "2026-10-15"
---

判断决定哪一段会执行。

### if

库存是 0 时走另一句。

```cpp run expect="soldout" title="没有库存"
#include <iostream>
int main() {
  int stock = 0;
  if (stock == 0) std::cout << "soldout\n";
  else std::cout << "instock\n";
  return 0;
}
```

输出里能看到 `soldout`。

### switch

每个分支都写 `break`，避免掉进下一支。

```cpp run expect="second" title="第二支"
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

输出里能看到 `second`。

### 条件里的 0

0 是假，所以三元运算符选择后面那一项。

```cpp run expect="none" title="零为假"
#include <iostream>
int main() {
  int n = 0;
  std::cout << (n ? "has" : "none") << "\n";
  return 0;
}
```

输出里能看到 `none`。
