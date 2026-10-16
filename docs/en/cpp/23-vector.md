---
language: cpp
chapter: 23
title: "C++ Vector"
level: beginner
minutes: 8
goals:
  - "Append an element with push_back"
  - "Replace an element by index"
  - "Read the element count with size"
sources:
  - learncpp
updated: "2026-10-16"
---

A `vector` keeps elements in the order you append them. This chapter does not sort that order.

### Append

Push 2, then push 8. The length is 2, and the element at index 1 is 8.

```cpp run expect="2 8" title="After append"
#include <iostream>
#include <vector>
int main() {
  std::vector<int> v;
  v.push_back(2);
  v.push_back(8);
  std::cout << v.size() << " " << v[1] << "\n";
  return 0;
}
```

Length and second element print as `2 8`.

### Replace one element

Index 0 changes from 2 to 9. `front` reads that same first element.

```cpp run expect="9" title="First element"
#include <iostream>
#include <vector>
int main() {
  std::vector<int> v{2, 8, 5};
  v[0] = 9;
  std::cout << v.front() << "\n";
  return 0;
}
```

The first element is now `9`.

### Clear

After `clear`, `empty` is true, and a true `bool` prints as 1.

```cpp run expect="1" title="Already empty"
#include <iostream>
#include <vector>
int main() {
  std::vector<int> v{2, 8};
  v.clear();
  std::cout << v.empty() << "\n";
  return 0;
}
```

Empty prints as `1`.
