---
language: cpp
chapter: 28
title: "C++ 多态"
level: beginner
minutes: 8
goals:
  - "用虚函数按实际类型调用"
  - "通过基类指针删除对象"
  - "给基类一个虚析构函数"
sources:
  - learncpp
updated: "2026-10-15"
---

只有通过基类指针或引用调用，才会走到派生类的版本。

### 虚函数

指针的静态类型是 `Tag`，实际对象是 `PenTag`，所以打印 2。

```cpp run expect="2" title="派生版本"
#include <iostream>
struct Tag {
  virtual int id() const { return 1; }
  virtual ~Tag() {}
};
struct PenTag : Tag {
  int id() const override { return 2; }
};
int main() {
  Tag *p = new PenTag();
  std::cout << p->id() << "\n";
  delete p;
  return 0;
}
```

输出里能看到 `2`。

### 基类版本

对象本身就是 `Tag` 时，`id` 返回 1。

```cpp run expect="1" title="基类版本"
#include <iostream>
struct Tag {
  virtual int id() const { return 1; }
  virtual ~Tag() {}
};
int main() {
  Tag tag;
  std::cout << tag.id() << "\n";
  return 0;
}
```

输出里能看到 `1`。

### 引用也能分派

函数参数是基类引用，传进去的是派生对象。

```cpp run expect="2" title="引用分派"
#include <iostream>
struct Tag {
  virtual int id() const { return 1; }
  virtual ~Tag() {}
};
struct PenTag : Tag {
  int id() const override { return 2; }
};
int show(const Tag &tag) { return tag.id(); }
int main() {
  PenTag pen;
  std::cout << show(pen) << "\n";
  return 0;
}
```

输出里能看到 `2`。
