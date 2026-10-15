---
language: cpp
chapter: 20
title: "C++ 日期与时间"
level: beginner
minutes: 8
goals:
  - "用固定的 tm 字段拼出日期"
  - "不依赖当前时区"
  - "用 difftime 计算两个时刻的差"
sources:
  - learncpp
updated: "2026-10-15"
---

当前时间每次运行都不同。例子改用写死的字段。

### 拼日期

`tm_year` 是从 1900 起算，10 月要写成 9。

```cpp run expect="2026-10-15" title="固定日期"
#include <ctime>
#include <iostream>
int main() {
  std::tm t{};
  t.tm_year = 126;
  t.tm_mon = 9;
  t.tm_mday = 15;
  char buf[16]{};
  std::strftime(buf, sizeof buf, "%Y-%m-%d", &t);
  std::cout << buf << "\n";
  return 0;
}
```

输出里能看到 `2026-10-15`。

### 只读字段

不调用 `mktime`，直接看已经写下的日。

```cpp run expect="15" title="日"
#include <ctime>
#include <iostream>
int main() {
  std::tm t{};
  t.tm_mday = 15;
  std::cout << t.tm_mday << "\n";
  return 0;
}
```

输出里能看到 `15`。

### 时间差

`difftime` 用两个 `time_t` 相减，单位是秒。

```cpp run expect="30" title="三十秒"
#include <ctime>
#include <iostream>
int main() {
  std::time_t early = 100;
  std::time_t late = 130;
  std::cout << std::difftime(late, early) << "\n";
  return 0;
}
```

输出里能看到 `30`。
