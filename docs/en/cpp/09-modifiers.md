---
language: cpp
chapter: 9
title: "C++ Modifier Types"
level: beginner
minutes: 8
goals:
  - "Separate short, long, and int"
  - "Use unsigned when the value is not negative"
  - "Hold a larger integer in long long"
sources:
  - learncpp
updated: "2026-10-16"
---

A modifier changes how wide an integer is, or whether it carries a sign. The samples below check the stored numbers. They do not compare the byte sizes of those types.

### short and long

Both `short` and `long` are used here only to hold small integers. The printed pair is 4 and 5.

```cpp run expect="4 5" title="Two widths"
#include <iostream>
int main() {
  short small = 4;
  long wide = 5;
  std::cout << small << " " << wide << "\n";
  return 0;
}
```

The pair on the line is `4 5`.

### unsigned

An `unsigned int` set to 3 still prints as 3. The sample does not try to store a negative count.

```cpp run expect="3" title="A count"
#include <iostream>
int main() {
  unsigned int count = 3;
  std::cout << count << "\n";
  return 0;
}
```

The unsigned count prints as `3`.

### A wider integer

`long long` can hold a value past 32 bits. This listing only stores the small value 18.

```cpp run expect="18" title="Wide integer"
#include <iostream>
int main() {
  long long big = 18;
  std::cout << big << "\n";
  return 0;
}
```

The wide integer prints as `18`.
