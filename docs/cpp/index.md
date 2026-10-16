---
language: cpp
chapter: 0
title: "C++ 教程"
minutes: 8
goals:
  - "用 std::cout 打出一行"
  - "让 main 返回 0"
  - "知道排序和抛出不放进可运行例子"
sources:
  - learncpp
updated: "2026-10-15"
---

这一本由 clang 按 C++ 编译并链接 libc++。例子都放在同一个文件里。

### 第一行

`std::cout` 不会自己换行，换行写在字符串里。

```cpp run expect="Hi" title="打招呼"
#include <iostream>
int main() {
  std::cout << "Hi\n";
  return 0;
}
```

输出里能看到 `Hi`。

### 返回零

返回 0 表示这次程序正常结束。

```cpp run expect="0" title="正常结束"
#include <iostream>
int main() {
  std::cout << 0 << "\n";
  return 0;
}
```

输出里能看到 `0`。

### 两条边界

`std::sort` 链接时会要 `__lttf2`。`throw` 在这份运行时里也不稳定。这两处只作阅读。

```cpp norun title="排序和抛出"
#include <algorithm>
#include <vector>
int main() {
  std::vector<int> v{3, 1};
  std::sort(v.begin(), v.end());
  throw 1;
  return 0;
}
```
