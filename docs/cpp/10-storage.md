---
language: cpp
chapter: 10
title: "C++ 存储类"
level: beginner
minutes: 8
goals:
  - "用 static 记住函数里的上一次"
  - "用 extern 声明别处定义的变量"
  - "用 mutable 在 const 方法里计数"
sources:
  - learncpp
updated: "2026-10-15"
---

存储类说明名字活多久、放在哪。`register` 不再使用。`auto` 在这份方言里表示类型推导，已经写在环境一章。

### 函数内的 static

每次调用都在上次的数上加一。

```cpp run expect="2" title="第二次"
#include <iostream>
int next_id() {
  static int n = 0;
  n += 1;
  return n;
}
int main() {
  next_id();
  std::cout << next_id() << "\n";
  return 0;
}
```

输出里能看到 `2`。

### extern

`extern` 只是声明。定义写在后面，仍在这个文件里。

```cpp run expect="18" title="同一文件的定义"
#include <iostream>
extern int price;
int price = 18;
int main() {
  std::cout << price << "\n";
  return 0;
}
```

输出里能看到 `18`。

### mutable

常量方法不能改普通成员，可以改 `mutable` 计数。

```cpp run expect="7 2" title="读了两次"
#include <iostream>
struct Meter {
  mutable int reads;
  int value;
  int get() const {
    reads += 1;
    return value;
  }
};
int main() {
  Meter meter{0, 7};
  meter.get();
  std::cout << meter.get() << " " << meter.reads << "\n";
  return 0;
}
```

输出里能看到 `7 2`。
