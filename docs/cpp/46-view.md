---
language: cpp
chapter: 46
title: "C++ string_view"
level: advanced
minutes: 10
goals:
  - "用 string_view 查看一段字符"
  - "取前缀而不复制整串"
  - "用手写的 Maybe 代替还没有的 optional"
sources:
  - cppreference
updated: "2026-10-20"
---

`string_view` 在这份 C++14 的 libc++ 里可用。它只保存指针和长度，不拥有字符。`std::optional` 要 C++17，头文件在这个标准下是空的，所以用一个只装 `int` 的小类型演示「可能没有值」。

### 长度是 3

`"tea"` 的 `string_view` 长度是 3。它不分配新的缓冲区。

```cpp run expect="3" title="tea 的长度"
#include <iostream>
#include <string_view>
int main() {
  std::string_view word("tea");
  std::cout << word.size() << "\n";
  return 0;
}
```

长度是 3。

### 前三个字符

`"teapot"` 的前缀长度是 3。`substr` 返回的仍是视图，再取 `size`。

```cpp run expect="3" title="前缀长度"
#include <iostream>
#include <string_view>
int main() {
  std::string_view word("teapot");
  std::cout << word.substr(0, 3).size() << "\n";
  return 0;
}
```

前缀长度是 3。

### 两段视图相等

两个 `string_view` 都指向字面量 `"tea"`。相等比较看的是字符，不是指针是否相同。相同就打印 `yes`。

```cpp run expect="yes" title="字符相同"
#include <iostream>
#include <string_view>
int main() {
  std::string_view left("tea");
  std::string_view right("tea");
  std::cout << (left == right ? "yes" : "no") << "\n";
  return 0;
}
```

两段字符相同，输出 `yes`。

### 练习：Maybe 里的 8

`Maybe` 用 `ok` 表示有没有值。有值时 `get` 返回 8。`std::optional` 的写法留在只读块里，这份编译器会说它未声明。

《C++ Primer》把 `optional` 放在更后面的标准里。只留书目：https://book.douban.com/subject/25708312 。

```cpp norun title="optional 需要 C++17"
#include <optional>
int main() {
  std::optional<int> slot(4);
  return *slot;
}
```

```cpp run expect="8" title="有值就取出"
#include <iostream>
struct Maybe {
  int value;
  bool ok;
  int get() const { return ok ? value : 0; }
};
int main() {
  Maybe slot{8, true};
  std::cout << slot.get() << "\n";
  return 0;
}
```

取出来是 8。
