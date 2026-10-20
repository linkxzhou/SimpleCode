---
language: cpp
chapter: 49
title: "C++ 失败时不改原值"
level: advanced
minutes: 10
goals:
  - "失败时保持原来的数量"
  - "成功时两个字段一起改"
  - "用析构把标志复位"
sources:
  - cppreference
updated: "2026-10-20"
---

异常安全讲的是失败之后对象还是否完整。这份 clang 关闭了异常，`throw` 不能编译。同样的承诺可以用返回码做到：检查失败时不写字段；检查通过后一次写完。析构函数仍然负责把临时标志清掉。

### 数量不够就不搬

`tea` 只有 4，要搬 9 会失败。函数返回 1，并且不改 `tea`。打印 `fail 4`。

```cpp run expect="fail 4" title="不够就不动"
#include <iostream>
int move_qty(int *src, int *dst, int n) {
  if (n < 0 || *src < n) return 1;
  *src -= n;
  *dst += n;
  return 0;
}
int main() {
  int tea = 4;
  int cup = 1;
  int rc = move_qty(&tea, &cup, 9);
  std::cout << (rc ? "fail " : "ok ") << tea << "\n";
  return 0;
}
```

失败后 tea 仍是 4。

### 够了就两边一起改

从 4 里搬走 3，tea 变成 1，cup 从 1 变成 4。这一题只打印 tea，确认源减少了。返回码是 0，前缀是 `ok`。

```cpp run expect="ok 1" title="搬得动"
#include <iostream>
int move_qty(int *src, int *dst, int n) {
  if (n < 0 || *src < n) return 1;
  *src -= n;
  *dst += n;
  return 0;
}
int main() {
  int tea = 4;
  int cup = 1;
  int rc = move_qty(&tea, &cup, 3);
  std::cout << (rc ? "fail " : "ok ") << tea << "\n";
  return 0;
}
```

成功后 tea 是 1。

### 离开作用域就清标志

`Flag` 构造时把槽写成 1，析构时写回 0。内层块结束之后槽是 0。这代替「出了异常也要解锁」：没有异常，析构仍然会跑。

```cpp run expect="0" title="析构清掉标志"
#include <iostream>
struct Flag {
  int *slot;
  Flag(int *p) : slot(p) { *slot = 1; }
  ~Flag() { *slot = 0; }
};
int main() {
  int slot = 0;
  {
    Flag guard(&slot);
  }
  std::cout << slot << "\n";
  return 0;
}
```

块结束之后标志是 0。

### 练习：throw 不能编译

下面的 `try` / `throw` 在关闭异常的编译器上直接失败。强保证的形状用前面的返回码代替，不运行这一段。

《Effective C++》有条款讨论异常保证。正文不搬：https://book.douban.com/subject/1842426 。

```cpp norun title="异常被关掉了"
#include <iostream>
int main() {
  try {
    throw 1;
  } catch (int x) {
    std::cout << x << "\n";
  }
  return 0;
}
```

阅读块里的 `throw` 不会被编译。
