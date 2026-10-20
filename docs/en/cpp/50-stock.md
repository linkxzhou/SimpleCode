---
language: cpp
chapter: 50
title: "C++ a small inventory"
level: intermediate
minutes: 10
goals:
  - "Record a quantity per sku in a map"
  - "Add to a sku that is already present"
  - "Total two skus"
sources:
  - cppreference
updated: "2026-10-20"
---

The inventory is a `map<string, int>`. The key is a sku and the value is a count. Every run starts from an empty map. There is no file. `operator[]` inserts 0 when the key is missing, so reading an unknown sku yields 0 and also puts the key into the map.

### The first receipt

`"tea"` gains 4. The key was absent, so `+=` starts from 0 and the result is 4.

```cpp run expect="4" title="Receive tea"
#include <iostream>
#include <map>
#include <string>
int main() {
  std::map<std::string, int> stock;
  stock["tea"] += 4;
  std::cout << stock["tea"] << "\n";
  return 0;
}
```

The tea count is 4.

### Add again

Four is already stored. Adding 3 makes 7. The same key does not become a second row.

```cpp run expect="7" title="Add 3 more"
#include <iostream>
#include <map>
#include <string>
int main() {
  std::map<std::string, int> stock;
  stock["tea"] += 4;
  stock["tea"] += 3;
  std::cout << stock["tea"] << "\n";
  return 0;
}
```

Tea is now 7.

### Total of two skus

Tea has 4 and cup has 6. Iteration follows key order, cup before tea, but the total does not depend on that order. The total is 10.

```cpp run expect="10" title="Total"
#include <iostream>
#include <map>
#include <string>
int main() {
  std::map<std::string, int> stock;
  stock["tea"] = 4;
  stock["cup"] = 6;
  int total = 0;
  for (auto it = stock.begin(); it != stock.end(); ++it) total += it->second;
  std::cout << total << "\n";
  return 0;
}
```

The total is 10.

### Exercise: an unseen sku is 0

`"mug"` has not been received. `operator[]` inserts 0 and returns it. The line is 0. A read can change the map. A presence test would use `find`. This exercise uses the subscript on purpose to show that behavior.

```cpp run expect="0" title="A new key is 0"
#include <iostream>
#include <map>
#include <string>
int main() {
  std::map<std::string, int> stock;
  std::cout << stock["mug"] << "\n";
  return 0;
}
```

An unseen sku reads as 0.
