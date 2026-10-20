---
language: cpp
chapter: 44
title: "C++ 算法"
level: intermediate
minutes: 10
goals:
  - "用 find 和 count 查看元素"
  - "用 accumulate 和 for_each 求和"
  - "把 sort 留在不能链接的例子里"
sources:
  - cppreference
updated: "2026-10-20"
---

`<algorithm>` 和 `<numeric>` 里有一批不改顺序的算法。`std::sort` 会把缺失的 `__lttf2` 拉进链接，所以仍然不运行。下面的例子只查找、计数和累加。

### 找到 9

`find` 在 `{4, 9}` 里指向 9。解引用得到 9。它不保证后面还有别的 9，这一题只有一个。

```cpp run expect="9" title="找到 9"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> row{4, 9};
  std::cout << *std::find(row.begin(), row.end(), 9) << "\n";
  return 0;
}
```

找到的元素是 9。

### 1 出现两次

`count` 统计等于 1 的个数。`{1, 2, 1}` 里有两个 1。

```cpp run expect="2" title="数一数"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> row{1, 2, 1};
  std::cout << std::count(row.begin(), row.end(), 1) << "\n";
  return 0;
}
```

个数是 2。

### 累加与 for_each

`accumulate` 从 0 开始加 `{1, 2, 3}`，得到 6。另一段用 `for_each` 把 `{1, 2}` 加进外部变量，得到 3。两段程序分开，避免一个 `main` 里塞两件无关的事。

```cpp run expect="6" title="累加到 6"
#include <iostream>
#include <numeric>
#include <vector>
int main() {
  std::vector<int> row{1, 2, 3};
  std::cout << std::accumulate(row.begin(), row.end(), 0) << "\n";
  return 0;
}
```

累加是 6。

### 练习：for_each 求和

lambda 按引用捕获 `sum`，把每个元素加进去。1 加 2 是 3。`sort` 的清单只阅读。

```cpp norun title="排序链接失败"
#include <algorithm>
#include <vector>
int main() {
  std::vector<int> row{3, 1};
  std::sort(row.begin(), row.end());
  return 0;
}
```

```cpp run expect="3" title="for_each 求和"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> row{1, 2};
  int sum = 0;
  std::for_each(row.begin(), row.end(), [&](int n) { sum += n; });
  std::cout << sum << "\n";
  return 0;
}
```

两格之和是 3。
