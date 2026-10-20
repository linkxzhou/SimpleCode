---
language: cpp
chapter: 41
title: "C++ unique_ptr"
level: intermediate
minutes: 10
goals:
  - "用 unique_ptr 管一个堆上的 int"
  - "用 make_unique 创建"
  - "移走之后原指针为空"
sources:
  - cppreference
  - modern-cpp-tutorial
updated: "2026-10-20"
---

`unique_ptr` 独占一块堆内存，离开作用域时自动 `delete`。同一时刻只有一个主人。这份 clang 在编译 `shared_ptr` 时会在代码生成阶段崩溃，所以共享所有权只留阅读，可运行的例子全部用 `unique_ptr`。

### 堆上的 7

`new int(7)` 交给 `unique_ptr`。解引用得到 7。`main` 结束时指针析构，不需要手写 `delete`。

```cpp run expect="7" title="独占的 7"
#include <iostream>
#include <memory>
int main() {
  std::unique_ptr<int> slot(new int(7));
  std::cout << *slot << "\n";
  return 0;
}
```

读出来是 7。

### make_unique

`make_unique<int>(11)` 在 C++14 里可用，少写一次 `new`。里面的值是 11。

```cpp run expect="11" title="make_unique"
#include <iostream>
#include <memory>
int main() {
  auto slot = std::make_unique<int>(11);
  std::cout << *slot << "\n";
  return 0;
}
```

值是 11。

### 移走之后为空

`std::move` 把所有权交给 `kept`。原来的 `slot` 变成空。打印 `kept` 的 7，再打印 `slot` 是否非空：空就是 0，连在一起是 `70`。

```cpp run expect="70" title="移动后变空"
#include <iostream>
#include <memory>
#include <utility>
int main() {
  std::unique_ptr<int> slot(new int(7));
  std::unique_ptr<int> kept(std::move(slot));
  std::cout << *kept << (slot ? 1 : 0) << "\n";
  return 0;
}
```

输出 `70`：值还在，原指针已经空了。

### 练习：结构体字段

`Item` 只有一个 `price`。`make_unique<Item>()` 默认构造后再写入 4。`shared_ptr` 的形状留在下面，不参加运行。

```cpp norun title="shared_ptr 会让编译器崩溃"
#include <memory>
int main() {
  std::shared_ptr<int> slot = std::make_shared<int>(8);
  return *slot;
}
```

```cpp run expect="4" title="字段是 4"
#include <iostream>
#include <memory>
struct Item {
  int price;
};
int main() {
  auto item = std::make_unique<Item>();
  item->price = 4;
  std::cout << item->price << "\n";
  return 0;
}
```

字段是 4。
