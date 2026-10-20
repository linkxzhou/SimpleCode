---
language: cpp
chapter: 39
title: "C++ auto and range-for"
level: intermediate
minutes: 9
goals:
  - "Let auto follow the initializer"
  - "Walk an array with range-for"
  - "Count values above a threshold in a vector"
sources:
  - cppreference
  - modern-cpp-tutorial
updated: "2026-10-20"
---

This compiler is in C++14 mode. `auto` deduces a type from the initializer. It does not keep a reference unless it is written `auto &`. Range-for walks an array or a `vector` once. The Modern C++ Tutorial is MIT licensed. These programs do not copy its paragraphs: https://github.com/changkun/modern-cpp-tutorial .

### Sum an array

The type of `n` is deduced as `int` from the elements of `{1, 2, 3}`. Range-for adds the three cells into `sum`, which becomes 6.

```cpp run expect="6" title="Sum of three cells"
#include <iostream>
int main() {
  int row[] = {1, 2, 3};
  int sum = 0;
  for (auto n : row) sum += n;
  std::cout << sum << "\n";
  return 0;
}
```

The three cells add up to 6.

### A copy is not the cell

`auto n` in a range-for is a copy. Doubling the copy does not change the array. The first element is still 1. Writing back requires `auto &`.

```cpp run expect="1" title="Copy leaves the array"
#include <iostream>
int main() {
  int row[] = {1, 2, 3};
  for (auto n : row) n = n * 2;
  std::cout << row[0] << "\n";
  return 0;
}
```

The first cell is still 1.

### A reference writes back

`auto &n` binds to the element itself. After each element increases by one, the last cell changes from 3 to 4.

```cpp run expect="4" title="Last cell written"
#include <iostream>
int main() {
  int row[] = {1, 2, 3};
  for (auto &n : row) n = n + 1;
  std::cout << row[2] << "\n";
  return 0;
}
```

The last cell becomes 4.

### Exercise: count values above 2

The `vector` holds 1, 4, 2, and 5. Range-for takes each value by `auto`. The values above 2 are 4 and 5, so the count is 2.

```cpp run expect="2" title="Two values above 2"
#include <iostream>
#include <vector>
int main() {
  std::vector<int> row{1, 4, 2, 5};
  int count = 0;
  for (auto n : row) {
    if (n > 2) count++;
  }
  std::cout << count << "\n";
  return 0;
}
```

Two values are above 2.
