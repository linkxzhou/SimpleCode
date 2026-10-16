---
language: cpp
chapter: 12
title: "C++ Loops"
level: beginner
minutes: 8
goals:
  - "Accumulate with for"
  - "Count down with while"
  - "Stop early with break"
sources:
  - learncpp
updated: "2026-10-16"
---

A loop repeats one piece of logic. Write the condition first, then the body that should run while that condition holds.

### for

`i` runs from 1 through 3, and each value is added into `sum`. The total of those three numbers is 6.

```cpp run expect="6" title="Sum"
#include <iostream>
int main() {
  int sum = 0;
  for (int i = 1; i <= 3; ++i) sum += i;
  std::cout << sum << "\n";
  return 0;
}
```

The accumulated total is `6`.

### while

`n` starts at 3 and steps down to 0. Adding on the way produces the same total, 6.

```cpp run expect="6" title="Count down and add"
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

The accumulated total is `6`.

### break

The loop leaves as soon as `i` is 3. Only 1 and 2 are written, with no separator between them.

```cpp run expect="12" title="Stop before 3"
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

The digits written before the stop are `12`.
