---
language: cpp
chapter: 22
title: "C++ 结构体"
level: beginner
minutes: 8
goals:
  - "把字段放进 struct"
  - "用点号读取"
  - "通过指针用箭头读取"
sources:
  - learncpp
updated: "2026-10-15"
---

结构体把若干字段收成一个类型。

### 点号

变量后面用 `.` 读字段。

```cpp run expect="tea 18" title="两个字段"
#include <iostream>
#include <string>
struct Item {
  std::string name;
  int price;
};
int main() {
  Item item{"tea", 18};
  std::cout << item.name << " " << item.price << "\n";
  return 0;
}
```

输出里能看到 `tea 18`。

### 改字段

字段可以在创建后再赋值。

```cpp run expect="18" title="改价"
#include <iostream>
struct Item { int price; };
int main() {
  Item item{12};
  item.price = 18;
  std::cout << item.price << "\n";
  return 0;
}
```

输出里能看到 `18`。

### 箭头

指针指向结构体时，用 `->` 读字段。

```cpp run expect="18" title="指针读字段"
#include <iostream>
struct Item { int price; };
int main() {
  Item item{18};
  Item *p = &item;
  std::cout << p->price << "\n";
  return 0;
}
```

输出里能看到 `18`。
