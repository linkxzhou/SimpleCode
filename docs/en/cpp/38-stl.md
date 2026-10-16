---
language: cpp
chapter: 38
title: "C++ STL Algorithms"
level: beginner
minutes: 8
goals:
  - "Find the minimum with min_element"
  - "Count matches with count"
  - "Find the maximum with max_element and leave sort unread"
sources:
  - learncpp
updated: "2026-10-16"
---

Minimum, maximum, and a count do not rearrange the elements. `std::sort` is the one that pulls the missing `__lttf2` into the link, so that call stays in a listing the page does not run.

### The minimum

`min_element` points at 2. The original order of 8, 2, 5 is left as it was.

```cpp run expect="2" title="Minimum is 2"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> v{8, 2, 5};
  std::cout << *std::min_element(v.begin(), v.end()) << "\n";
  return 0;
}
```

The algorithm prints `2`.

### A count

The value 2 occurs twice among the three slots. `count` reports that number of matches.

```cpp run expect="2" title="Appears twice"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> v{2, 8, 2};
  std::cout << std::count(v.begin(), v.end(), 2) << "\n";
  return 0;
}
```

The algorithm prints `2`.

### The maximum

`max_element` points at 8. The order is still the original 8, 2, 5.

```cpp run expect="8" title="Maximum is 8"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> v{8, 2, 5};
  std::cout << *std::max_element(v.begin(), v.end()) << "\n";
  return 0;
}
```

The algorithm prints `8`.

### sort does not run

Even when every element is an `int`, `std::sort` still requires `__lttf2`. The listing is kept for reading only.

```cpp norun title="The link would fail"
#include <algorithm>
#include <vector>
int main() {
  std::vector<int> v{8, 2, 5};
  std::sort(v.begin(), v.end());
  return 0;
}
```
