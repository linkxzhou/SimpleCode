---
language: cpp
chapter: 38
title: "C++ STL 算法"
level: beginner
minutes: 8
goals:
  - "用 min_element 找最小"
  - "用 count 统计次数"
  - "用 max_element 找最大，把 sort 留在只读例子里"
sources:
  - learncpp
updated: "2026-10-15"
---

最小值、最大值和计数不需要重排元素。`std::sort` 会把缺少的 `__lttf2` 拉进链接。

### 最小

`min_element` 指向 2，不改变原来的次序。

```cpp run expect="2" title="最小是 2"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> v{8, 2, 5};
  std::cout << *std::min_element(v.begin(), v.end()) << "\n";
  return 0;
}
```

输出里能看到 `2`。

### 计数

2 在这三格里出现两次。

```cpp run expect="2" title="出现两次"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> v{2, 8, 2};
  std::cout << std::count(v.begin(), v.end(), 2) << "\n";
  return 0;
}
```

输出里能看到 `2`。

### 最大

`max_element` 指向 8，次序仍是原来的 8、2、5。

```cpp run expect="8" title="最大是 8"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> v{8, 2, 5};
  std::cout << *std::max_element(v.begin(), v.end()) << "\n";
  return 0;
}
```

输出里能看到 `8`。

### 排序不运行

即使元素只是 `int`，`std::sort` 仍会要 `__lttf2`。

```cpp norun title="链接会失败"
#include <algorithm>
#include <vector>
int main() {
  std::vector<int> v{8, 2, 5};
  std::sort(v.begin(), v.end());
  return 0;
}
```
