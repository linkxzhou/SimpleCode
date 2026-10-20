---
language: cpp
chapter: 45
title: "C++ map 与 unordered_map"
level: intermediate
minutes: 10
goals:
  - "用有序 map 按键取出值"
  - "按键的顺序遍历"
  - "用 unordered_map 保存字符串键"
sources:
  - cppreference
updated: "2026-10-20"
---

`map` 按键排序，遍历顺序稳定。`unordered_map` 的遍历顺序不稳定，所以只按键查找，不靠迭代器顺序当答案。键是 `int` 或 `std::string`。C++14 不能写结构化绑定，遍历用迭代器的 `first` 和 `second`。

### 键 2 对应 9

`price[2] = 9` 插入或覆盖。再读同一个键，得到 9。

```cpp run expect="9" title="按键读取"
#include <iostream>
#include <map>
int main() {
  std::map<int, int> price;
  price[2] = 9;
  std::cout << price[2] << "\n";
  return 0;
}
```

键 2 的值是 9。

### 键从小到大

先放入键 3，再放入键 1。`map` 遍历时键的顺序是 1 然后 3。中间用逗号隔开。

```cpp run expect="1,3" title="键已排序"
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

键的顺序是 `1,3`。

### 字符串键

`unordered_map<std::string, int>` 用 `"tea"` 当键，值是 4。只查找这一个键，不遍历。

```cpp run expect="4" title="tea 的数量"
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

`tea` 对应 4。

### 练习：map 的大小

放入两个不同的键之后，`size()` 是 2。同一个键再赋值不会增加大小，这一题不重复键。

```cpp run expect="2" title="两把钥匙"
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

大小是 2。
