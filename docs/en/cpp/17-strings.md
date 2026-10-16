---
language: cpp
chapter: 17
title: "C++ Strings"
level: beginner
minutes: 8
goals:
  - "Join two pieces of text"
  - "Read the byte count with size"
  - "Take the tail with substr"
sources:
  - learncpp
updated: "2026-10-16"
---

`std::string` counts bytes. `Hello!` has length 6, so `size` returns 6.

### Concatenation

`+=` attaches the second piece to the same string. `"buy"` plus `" pen"` becomes `buy pen`.

```cpp run expect="buy pen" title="Append"
#include <iostream>
#include <string>
int main() {
  std::string s = "buy";
  s += " pen";
  std::cout << s << "\n";
  return 0;
}
```

The joined text is `buy pen`.

### Length in bytes

`Hello!` occupies 6 bytes. `size` reports that byte count.

```cpp run expect="6" title="Six bytes"
#include <iostream>
#include <string>
int main() {
  std::string s = "Hello!";
  std::cout << s.size() << "\n";
  return 0;
}
```

The byte count is `6`.

### A slice

`substr(4)` starts at index 4 and continues to the end. On `"buy pen"` that tail is `pen`.

```cpp run expect="pen" title="The tail"
#include <iostream>
#include <string>
int main() {
  std::string s = "buy pen";
  std::cout << s.substr(4) << "\n";
  return 0;
}
```

The tail of the string is `pen`.
