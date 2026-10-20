---
language: cpp
chapter: 42
title: "C++ RAII"
level: intermediate
minutes: 9
goals:
  - "在构造时取得、在析构时放开"
  - "看两个对象的析构次序"
  - "提前 return 仍然会析构"
sources:
  - cppreference
updated: "2026-10-20"
---

RAII 把资源的生命周期绑在对象上。构造函数取得，析构函数放开。局部对象在离开作用域时析构，包括提前 `return`。这里用打印代替真正的锁或文件，因为这份运行时没有可练习的文件流。

### 先开后关

`Gate` 构造时打印 `open`，析构时打印 `shut`。中间的语句打印 `work`。次序是构造、函数体、析构。

```cpp run expect="open work shut" title="开关成对"
#include <iostream>
struct Gate {
  Gate() { std::cout << "open "; }
  ~Gate() { std::cout << "shut"; }
};
int main() {
  Gate gate;
  std::cout << "work ";
  return 0;
}
```

一行是 `open work shut`。

### 后构造的先析构

先构造的对象编号 1，后构造的编号 2。离开 `main` 时先析构 2，再析构 1。四个数字连在一起是 `1221`。

```cpp run expect="1221" title="析构倒序"
#include <iostream>
struct Mark {
  int id;
  Mark(int value) : id(value) { std::cout << id; }
  ~Mark() { std::cout << id; }
};
int main() {
  Mark first(1);
  Mark second(2);
  return 0;
}
```

输出 `1221`。

### 提前返回也会析构

`work` 在构造 `Gate` 之后立刻 `return`。析构仍会执行，所以 `shut` 还在。调用方在函数返回后才打印句点，用来看清析构发生在函数内部。

```cpp run expect="open shut." title="return 之前析构"
#include <iostream>
struct Gate {
  Gate() { std::cout << "open "; }
  ~Gate() { std::cout << "shut"; }
};
void work() {
  Gate gate;
  return;
}
int main() {
  work();
  std::cout << ".\n";
  return 0;
}
```

`shut` 出现在句点前面。

### 练习：活着的个数

`Live::count` 在构造时加一，析构时减一。内层块里有两个对象，个数是 2。块结束之后回到 0。两行是 `2` 和 `0`。

```cpp run expect="2\n0" title="离开后归零"
#include <iostream>
struct Live {
  static int count;
  Live() { count++; }
  ~Live() { count--; }
};
int Live::count = 0;
int main() {
  {
    Live left;
    Live right;
    std::cout << Live::count << "\n";
  }
  std::cout << Live::count << "\n";
  return 0;
}
```

块内是 2，块外是 0。
