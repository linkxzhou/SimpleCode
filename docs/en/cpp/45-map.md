---
language: cpp
chapter: 45
title: "C++ map and unordered_map"
level: intermediate
minutes: 10
goals:
  - "Read a value from an ordered map"
  - "Walk keys in sorted order"
  - "Store a string key in unordered_map"
sources:
  - cppreference
updated: "2026-10-20"
---

A `map` keeps keys sorted, so iteration order is stable. Iteration order of an `unordered_map` is not stable, so those samples only look up a key. They do not treat iterator order as the answer. Keys are `int` or `std::string`. C++14 has no structured bindings. Iteration uses `first` and `second` on the iterator.

### Key 2 holds 9

`price[2] = 9` inserts or overwrites. Reading the same key returns 9.

```cpp run expect="9" title="Read by key"
#include <iostream>
#include <map>
int main() {
  std::map<int, int> price;
  price[2] = 9;
  std::cout << price[2] << "\n";
  return 0;
}
```

Key 2 holds 9.

### Keys come out sorted

Key 3 is inserted first, then key 1. Walking the `map` yields key 1 and then key 3, separated by a comma.

```cpp run expect="1,3" title="Keys are sorted"
#include <iostream>
#include <map>
int main() {
  std::map<int, int> price;
  price[3] = 8;
  price[1] = 4;
  bool first = true;
  for (auto it = price.begin(); it != price.end(); ++it) {
    if (!first) std::cout << ",";
    first = false;
    std::cout << it->first;
  }
  std::cout << "\n";
  return 0;
}
```

The key order is `1,3`.

### A string key

`unordered_map<std::string, int>` uses `"tea"` as the key and stores 4. The program looks up that one key and does not iterate.

```cpp run expect="4" title="Quantity of tea"
#include <iostream>
#include <string>
#include <unordered_map>
int main() {
  std::unordered_map<std::string, int> stock;
  stock["tea"] = 4;
  std::cout << stock["tea"] << "\n";
  return 0;
}
```

`tea` maps to 4.

### Exercise: the size of a map

After two distinct keys are inserted, `size()` is 2. Assigning the same key again would not grow the map. This exercise does not repeat a key.

```cpp run expect="2" title="Two keys"
#include <iostream>
#include <map>
int main() {
  std::map<int, int> price;
  price[1] = 4;
  price[2] = 9;
  std::cout << price.size() << "\n";
  return 0;
}
```

The size is 2.
