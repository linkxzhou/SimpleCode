---
language: cpp
chapter: 25
title: "C++ 类与对象"
level: beginner
minutes: 8
goals:
  - "用构造函数保存单价"
  - "用常量方法读取"
  - "把数据放在 private 里"
sources:
  - learncpp
updated: "2026-10-15"
---

类把数据和读取它的方法放在一起。

### 构造

创建对象时就把 18 放进单价。

```cpp run expect="18" title="构造时写入"
#include <iostream>
class Pen {
 public:
  explicit Pen(int price) : price_(price) {}
  int price() const { return price_; }
 private:
  int price_;
};
int main() {
  Pen pen(18);
  std::cout << pen.price() << "\n";
  return 0;
}
```

输出里能看到 `18`。

### 两支笔

两个对象各自保存自己的单价。

```cpp run expect="12 18" title="互不影响"
#include <iostream>
class Pen {
 public:
  explicit Pen(int price) : price_(price) {}
  int price() const { return price_; }
 private:
  int price_;
};
int main() {
  Pen a(12);
  Pen b(18);
  std::cout << a.price() << " " << b.price() << "\n";
  return 0;
}
```

输出里能看到 `12 18`。

### 方法使用私有字段

外面不能直接改 `price_`，只能通过方法读。

```cpp run expect="7" title="只能读"
#include <iostream>
class Pen {
 public:
  explicit Pen(int price) : price_(price) {}
  int labeled() const { return price_; }
 private:
  int price_;
};
int main() {
  Pen pen(7);
  std::cout << pen.labeled() << "\n";
  return 0;
}
```

输出里能看到 `7`。
