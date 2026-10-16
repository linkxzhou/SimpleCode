---
language: cpp
chapter: 20
title: "C++ Date and Time"
level: beginner
minutes: 8
goals:
  - "Build a date from fixed tm fields"
  - "Avoid depending on the current time zone"
  - "Measure a gap with difftime"
sources:
  - learncpp
updated: "2026-10-16"
---

The current clock changes on every run. These samples fill `std::tm` with fixed fields instead, so the printed date stays the same.

### Assemble a date

`tm_year` counts from 1900, so 2026 is stored as 126. October is month 9, because January is 0. `strftime` then formats `2026-10-15`.

```cpp run expect="2026-10-15" title="Fixed date"
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

The formatted date is `2026-10-15`.

### Read a field directly

This sample never calls `mktime`. It prints the day that was written into `tm_mday`, which is 15.

```cpp run expect="15" title="Day"
#include <ctime>
#include <iostream>
int main() {
  std::tm t{};
  t.tm_mday = 15;
  std::cout << t.tm_mday << "\n";
  return 0;
}
```

The day field prints `15`.

### A difference in seconds

`difftime` subtracts two `time_t` values and reports seconds. From 100 to 130 the gap is 30.

```cpp run expect="30" title="Thirty seconds"
#include <ctime>
#include <iostream>
int main() {
  std::time_t early = 100;
  std::time_t late = 130;
  std::cout << std::difftime(late, early) << "\n";
  return 0;
}
```

The gap in seconds is `30`.
