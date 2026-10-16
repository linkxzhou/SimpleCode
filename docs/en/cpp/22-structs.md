---
language: cpp
chapter: 22
title: "C++ Structures"
level: beginner
minutes: 8
goals:
  - "Group fields inside a struct"
  - "Read a field with a dot"
  - "Read a field through a pointer with ->"
sources:
  - learncpp
updated: "2026-10-16"
---

A structure gathers several fields into one type. You reach a field with `.` on an object, or with `->` on a pointer to that object.

### The dot

After the variable name, `.` selects a field. `item` carries the name `茶` and the price 18.

```cpp run expect="茶 18" title="Two fields"
#include <iostream>
#include <string>
struct Item {
  std::string name;
  int price;
};
int main() {
  Item item{"茶", 18};
  std::cout << item.name << " " << item.price << "\n";
  return 0;
}
```

The field line is `茶 18`.

### Change a field

A field can be assigned after the object exists. `price` starts at 12 and is then set to 18.

```cpp run expect="18" title="Change the price"
#include <iostream>
struct Item { int price; };
int main() {
  Item item{12};
  item.price = 18;
  std::cout << item.price << "\n";
  return 0;
}
```

The field line is `18`.

### The arrow

When a pointer addresses a structure, `->` reads a field. `p->price` is the same field as `item.price`.

```cpp run expect="18" title="Read a field through a pointer"
#include <iostream>
struct Item { int price; };
int main() {
  Item item{18};
  Item *p = &item;
  std::cout << p->price << "\n";
  return 0;
}
```

The field line is `18`.
