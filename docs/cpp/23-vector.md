---
language: cpp
chapter: 23
title: "C++ vector 容器"
level: beginner
minutes: 8
goals:
  - "用 push_back 追加"
  - "用下标修改"
  - "用 size 看元素个数"
sources:
  - learncpp
updated: "2026-10-15"
---

`vector` 的次序就是追加的次序。这一章不排序。

### 追加

先放 2，再放 8。长度是 2，第二项是 8。

```cpp run expect="2 8" title="追加后"
#include <iostream>
#include <vector>
int main() {
  std::vector<int> v;
  v.push_back(2);
  v.push_back(8);
  std::cout << v.size() << " " << v[1] << "\n";
  return 0;
}
```

输出里能看到 `2 8`。

### 改一项

下标 0 从 2 改成 9。

```cpp run expect="9" title="第一项"
#include <iostream>
#include <vector>
int main() {
  std::vector<int> v{2, 8, 5};
  v[0] = 9;
  std::cout << v.front() << "\n";
  return 0;
}
```

输出里能看到 `9`。

### 清空

`clear` 之后 `empty` 为真，打印 1。

```cpp run expect="1" title="已经空了"
#include <iostream>
#include <vector>
int main() {
  std::vector<int> v{2, 8};
  v.clear();
  std::cout << v.empty() << "\n";
  return 0;
}
```

输出里能看到 `1`。
