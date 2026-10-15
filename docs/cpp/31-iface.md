---
language: cpp
chapter: 31
title: "C++ 接口"
level: beginner
minutes: 8
goals:
  - "用抽象类表示接口"
  - "让派生类实现两个方法"
  - "用基类引用调用"
sources:
  - learncpp
updated: "2026-10-15"
---

接口一章的抽象类有两个纯虚函数。派生类必须都实现。

### 两个方法

`Pen` 同时给出名字和单价。

```cpp run expect="笔 18" title="两项都有"
#include <iostream>
#include <string>
struct Goods {
  virtual std::string name() const = 0;
  virtual int price() const = 0;
  virtual ~Goods() {}
};
struct Pen : Goods {
  std::string name() const override { return "笔"; }
  int price() const override { return 18; }
};
int main() {
  Pen pen;
  std::cout << pen.name() << " " << pen.price() << "\n";
  return 0;
}
```

输出里能看到 `笔 18`。

### 通过接口调用

函数只接受 `const Goods &`。

```cpp run expect="18" title="只问价格"
#include <iostream>
#include <string>
struct Goods {
  virtual std::string name() const = 0;
  virtual int price() const = 0;
  virtual ~Goods() {}
};
struct Pen : Goods {
  std::string name() const override { return "笔"; }
  int price() const override { return 18; }
};
int ask(const Goods &goods) { return goods.price(); }
int main() {
  Pen pen;
  std::cout << ask(pen) << "\n";
  return 0;
}
```

输出里能看到 `18`。

### 另一个实现

`Ink` 也是 `Goods`，单价不同。

```cpp run expect="墨" title="另一种商品"
#include <iostream>
#include <string>
struct Goods {
  virtual std::string name() const = 0;
  virtual int price() const = 0;
  virtual ~Goods() {}
};
struct Ink : Goods {
  std::string name() const override { return "墨"; }
  int price() const override { return 7; }
};
int main() {
  Ink ink;
  std::cout << ink.name() << "\n";
  return 0;
}
```

输出里能看到 `墨`。
