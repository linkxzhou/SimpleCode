---
language: cpp
chapter: 50
title: "C++ 库存小账"
level: intermediate
minutes: 10
goals:
  - "用 map 记下每种货的数量"
  - "再次入库时累加"
  - "把两种货的数量加总"
sources:
  - cppreference
updated: "2026-10-20"
---

库存放在 `map<string, int>` 里。键是货号，值是件数。每次运行都从空表开始，没有文件。`operator[]` 在键不存在时会插入 0，读一个没见过的货号会得到 0，同时把键放进表里。

### 第一次入库

`"tea"` 加上 4。表里原来没有这把键，`+=` 从 0 开始加，结果是 4。

```cpp run expect="4" title="茶入库"
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

茶的数量是 4。

### 再加一次

已经有 4，再加 3，变成 7。同一键不会出现两行。

```cpp run expect="7" title="再加 3"
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

茶变成 7。

### 两种货的合计

茶 4 件，杯 6 件。遍历时按键排序，先杯后茶，但合计不依赖这个顺序。总数是 10。

```cpp run expect="10" title="合计"
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

合计是 10。

### 练习：没见过的货是 0

`"mug"` 还没有入库。`operator[]` 会插入 0 并返回它。打印 0。这提醒读操作也会改表，查存在与否要用 `find`，这一题故意用下标展示这个行为。

```cpp run expect="0" title="新键是 0"
#include <iostream>
#include <map>
#include <string>
int main() {
  std::map<std::string, int> stock;
  std::cout << stock["mug"] << "\n";
  return 0;
}
```

没见过的货号读出来是 0。
