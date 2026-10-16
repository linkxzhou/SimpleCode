---
language: cpp
chapter: 33
title: "C++ Exception Handling"
level: beginner
minutes: 8
goals:
  - "Report failure with a returned status"
  - "Leave the output parameter unused on failure"
  - "Keep throw in a sample that does not run"
sources:
  - learncpp
updated: "2026-10-16"
---

Do not use `throw` on this runtime. Report failure with a status code that the caller checks before it trusts the output parameter.

### throw is not executed

The `throw` below keeps the shape of an exception. The page does not run it.

```cpp norun title="Do not throw"
int main() {
  throw 1;
  return 0;
}
```

### Check the status

A return of 0 means the digit is usable. The function writes 4 through the pointer, and `main` prints that digit.

```cpp run expect="4" title="Success"
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

A zero status prints the digit `4`.

### Failure skips the number

When the text is not a digit, the function returns 1 and does not write `*out`. `main` prints only that status.

```cpp run expect="1" title="Failure"
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

The failure status prints as `1`.
