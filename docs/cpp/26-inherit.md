---
language: cpp
chapter: 26
title: "C++ 继承"
level: beginner
minutes: 8
goals:
  - "让派生类带上基类的字段"
  - "在构造时交给基类"
  - "派生类再保存自己的字段"
sources:
  - learncpp
updated: "2026-10-15"
---

派生类复用基类已经写好的读取方法。

### 基类单价

`Pen` 的单价来自 `Item`。

```cpp run expect="18" title="基类的单价"
#include <iostream>
class Item {
 public:
  explicit Item(int price) : price_(price) {}
  int price() const { return price_; }
 private:
  int price_;
};
class Pen : public Item {
 public:
  Pen(int price, int ink) : Item(price), ink_(ink) {}
  int ink() const { return ink_; }
 private:
  int ink_;
};
int main() {
  Pen pen(18, 2);
  std::cout << pen.price() << "\n";
  return 0;
}
```

输出里能看到 `18`。

### 派生字段

墨水量是 `Pen` 自己的，基类没有这一项。

```cpp run expect="2" title="墨水"
#include <iostream>
class Item {
 public:
  explicit Item(int price) : price_(price) {}
  int price() const { return price_; }
 private:
  int price_;
};
class Pen : public Item {
 public:
  Pen(int price, int ink) : Item(price), ink_(ink) {}
  int ink() const { return ink_; }
 private:
  int ink_;
};
int main() {
  Pen pen(18, 2);
  std::cout << pen.ink() << "\n";
  return 0;
}
```

输出里能看到 `2`。

### 一起打印

两个方法各读各的字段。

```cpp run expect="18 2" title="两项"
#include <iostream>
class Item {
 public:
  explicit Item(int price) : price_(price) {}
  int price() const { return price_; }
 private:
  int price_;
};
class Pen : public Item {
 public:
  Pen(int price, int ink) : Item(price), ink_(ink) {}
  int ink() const { return ink_; }
 private:
  int ink_;
};
int main() {
  Pen pen(18, 2);
  std::cout << pen.price() << " " << pen.ink() << "\n";
  return 0;
}
```

输出里能看到 `18 2`。
