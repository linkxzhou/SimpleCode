---
language: cpp
chapter: 12
title: "C++ 循环"
level: beginner
minutes: 8
goals:
  - "用 for 累加"
  - "用 while 倒数"
  - "用 break 提前停下"
sources:
  - learncpp
updated: "2026-10-15"
---

循环重复同一段逻辑。条件先写清楚，再写循环体。

### for

1 到 3 的和是 6。

```cpp run expect="6" title="求和"
#include <iostream>
int main() {
  int sum = 0;
  for (int i = 1; i <= 3; ++i) sum += i;
  std::cout << sum << "\n";
  return 0;
}
```

输出里能看到 `6`。

### while

从 3 减到 0，累加的结果同样是 6。

```cpp run expect="6" title="倒数累加"
#include <iostream>
int main() {
  int n = 3;
  int sum = 0;
  while (n > 0) {
    sum += n;
    n -= 1;
  }
  std::cout << sum << "\n";
  return 0;
}
```

输出里能看到 `6`。

### break

遇到 3 就停，所以只打出 1 和 2。

```cpp run expect="12" title="停在 3 之前"
#include <iostream>
int main() {
  for (int i = 1; i <= 5; ++i) {
    if (i == 3) break;
    std::cout << i;
  }
  std::cout << "\n";
  return 0;
}
```

输出里能看到 `12`。
