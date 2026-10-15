---
language: cpp
chapter: 33
title: "C++ 异常处理"
level: beginner
minutes: 8
goals:
  - "用返回值表示失败"
  - "失败时不使用输出参数"
  - "把 throw 留在不可运行的例子里"
sources:
  - learncpp
updated: "2026-10-15"
---

这份运行时里不要 `throw`。失败写成返回的状态码。

### 抛出不运行

下面的 `throw` 只保留形状，不参加运行。

```cpp norun title="不抛出"
int main() {
  throw 1;
  return 0;
}
```

### 检查状态

返回 0 才表示数字可用。

```cpp run expect="4" title="成功"
#include <iostream>
int parse_digit(const char *s, int *out) {
  if (s[0] < '0' || s[0] > '9') return 1;
  *out = s[0] - '0';
  return 0;
}
int main() {
  int n = 0;
  if (parse_digit("4", &n) == 0) std::cout << n << "\n";
  return 0;
}
```

输出里能看到 `4`。

### 失败就不打印数字

输入不是数字时，只打印状态 1。

```cpp run expect="1" title="失败"
#include <iostream>
int parse_digit(const char *s, int *out) {
  if (s[0] < '0' || s[0] > '9') return 1;
  *out = s[0] - '0';
  return 0;
}
int main() {
  int n = 0;
  int status = parse_digit("no", &n);
  std::cout << status << "\n";
  return 0;
}
```

输出里能看到 `1`。
