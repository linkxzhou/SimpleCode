---
language: cpp
chapter: 1
title: "C++ Introduction"
level: beginner
minutes: 8
goals:
  - "Store text in a standard string"
  - "Store integers in a vector"
  - "Keep every helper in this one file"
sources:
  - learncpp
updated: "2026-10-16"
---

What this book adds is the standard library, not a different compiler. `std::string` and `std::vector` are types you can use beside `main`. There is still only one translation unit to compile.

### A string

`std::string` keeps the characters and knows its own length. Here the whole value is the two-character word `笔`.

```cpp run expect="笔" title="One item"
#include <iostream>
#include <string>
int main() {
  std::string item = "笔";
  std::cout << item << "\n";
  return 0;
}
```

The program writes `笔`.

### A column of integers

`std::vector` grows when you call `push_back`. After one price is stored, `size` reports 1.

```cpp run expect="1" title="One price"
#include <iostream>
#include <vector>
int main() {
  std::vector<int> prices;
  prices.push_back(18);
  std::cout << prices.size() << "\n";
  return 0;
}
```

The program writes `1`.

### Still a single file

Put the helper above `main`. No second `.cpp` is linked, so `twice` has to live in this listing.

```cpp run expect="18" title="Same file"
#include <iostream>
int twice(int n) { return n * 2; }
int main() {
  std::cout << twice(9) << "\n";
  return 0;
}
```

The program writes `18`.
