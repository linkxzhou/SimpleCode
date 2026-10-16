---
language: cpp
chapter: 32
title: "C++ 文件和流"
level: beginner
minutes: 8
goals:
  - "知道这里没有可依赖的磁盘路径"
  - "用 ostringstream 准备一行"
  - "用 istringstream 读回数字"
sources:
  - learncpp
updated: "2026-10-15"
---

文件流可以在本机打开路径。这个编译结果不依赖你的磁盘。

### ofstream 留在阅读里

真实路径这里没有保证。

```cpp norun title="不写磁盘"
#include <fstream>
int main() {
  std::ofstream out("note.txt");
  out << "tea\n";
  return 0;
}
```

### 写进字符串流

`ostringstream` 先把一行放在内存里。

```cpp run expect="tea 18" title="一行文本"
#include <iostream>
#include <sstream>
int main() {
  std::ostringstream out;
  out << "tea " << 18;
  std::cout << out.str() << "\n";
  return 0;
}
```

输出里能看到 `tea 18`。

### 再读出来

`istringstream` 从这块文字里按空格读出整数。

```cpp run expect="18" title="读回"
#include <iostream>
#include <sstream>
int main() {
  std::istringstream in("18");
  int n = 0;
  in >> n;
  std::cout << n << "\n";
  return 0;
}
```

输出里能看到 `18`。
