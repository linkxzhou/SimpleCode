---
language: cpp
chapter: 17
title: "C++ 字符串"
level: beginner
minutes: 8
goals:
  - "拼接两段文字"
  - "用 size 看字节数"
  - "用 substr 取出后半段"
sources:
  - learncpp
updated: "2026-10-15"
---

`std::string` 按字节计数。`Hello!` 的长度是 6。

### 拼接

`+=` 把后半段接到同一份字符串上。

```cpp run expect="buy pen" title="接上"
#include <iostream>
#include <string>
int main() {
  std::string s = "buy";
  s += " pen";
  std::cout << s << "\n";
  return 0;
}
```

输出里能看到 `buy pen`。

### 字节长度

`Hello!` 有 6 个字节。

```cpp run expect="6" title="六个字节"
#include <iostream>
#include <string>
int main() {
  std::string s = "Hello!";
  std::cout << s.size() << "\n";
  return 0;
}
```

输出里能看到 `6`。

### 截取

`substr(4)` 从下标 4 取到末尾。

```cpp run expect="pen" title="后半段"
#include <iostream>
#include <string>
int main() {
  std::string s = "buy pen";
  std::cout << s.substr(4) << "\n";
  return 0;
}
```

输出里能看到 `pen`。
