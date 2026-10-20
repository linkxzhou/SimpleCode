---
language: cpp
chapter: 44
title: "C++ algorithms"
level: intermediate
minutes: 10
goals:
  - "Inspect elements with find and count"
  - "Add them with accumulate and for_each"
  - "Leave sort in the listing that does not link"
sources:
  - cppreference
updated: "2026-10-20"
---

`<algorithm>` and `<numeric>` include algorithms that do not reorder elements. `std::sort` pulls in the missing symbol `__lttf2` at link time, so it still does not run. The samples below only search, count, and add.

### Find 9

`find` points at 9 inside `{4, 9}`. Dereferencing that iterator yields 9. The call does not promise another 9 later. This vector has one.

```cpp run expect="9" title="Found 9"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> row{4, 9};
  std::cout << *std::find(row.begin(), row.end(), 9) << "\n";
  return 0;
}
```

The found element is 9.

### One appears twice

`count` reports how many elements equal 1. `{1, 2, 1}` contains two ones.

```cpp run expect="2" title="Count the ones"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> row{1, 2, 1};
  std::cout << std::count(row.begin(), row.end(), 1) << "\n";
  return 0;
}
```

The count is 2.

### Accumulate

`accumulate` starts at 0 and adds `{1, 2, 3}`, which is 6. A separate listing uses `for_each` so one `main` does not mix two unrelated jobs.

```cpp run expect="6" title="Add up to 6"
#include <iostream>
#include <numeric>
#include <vector>
int main() {
  std::vector<int> row{1, 2, 3};
  std::cout << std::accumulate(row.begin(), row.end(), 0) << "\n";
  return 0;
}
```

The sum is 6.

### Exercise: sum with for_each

The lambda captures `sum` by reference and adds each element. One plus two is 3. The `sort` listing is reading only.

```cpp norun title="Sort fails to link"
#include <algorithm>
#include <vector>
int main() {
  std::vector<int> row{3, 1};
  std::sort(row.begin(), row.end());
  return 0;
}
```

```cpp run expect="3" title="Sum with for_each"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> row{1, 2};
  int sum = 0;
  std::for_each(row.begin(), row.end(), [&](int n) { sum += n; });
  std::cout << sum << "\n";
  return 0;
}
```

The two cells add up to 3.
