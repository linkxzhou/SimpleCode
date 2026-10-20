---
language: cpp
chapter: 40
title: "C++ lambdas"
level: intermediate
minutes: 9
goals:
  - "Call a small function written in place"
  - "Capture an outer variable by value"
  - "Pass a lambda to a function template"
sources:
  - cppreference
  - modern-cpp-features
updated: "2026-10-20"
---

A lambda is a temporary object with a call operator. Parameters sit in parentheses and the body sits in braces. The capture list decides how outer variables come in. This dialect is C++14, so there are no structured bindings. Captures are still named. modern-cpp-features is MIT. Its entries are not copied: https://github.com/AnthonyCalandra/modern-cpp-features .

### Add one in place

`[](int x) { return x + 1; }` captures nothing. Calling it with 4 produces 5.

```cpp run expect="5" title="Add one"
#include <iostream>
int main() {
  auto step = [](int x) { return x + 1; };
  std::cout << step(4) << "\n";
  return 0;
}
```

Four plus one is 5.

### Capture by value

The outer `base` is 3. `[base]` copies that 3 into the lambda. Changing `base` afterwards leaves the captured copy at 3, and adding one produces 4.

```cpp run expect="4" title="Captured 3"
#include <iostream>
int main() {
  int base = 3;
  auto step = [base]() { return base + 1; };
  base = 9;
  std::cout << step() << "\n";
  return 0;
}
```

The call returns 4. Setting the outer variable to 9 later does not change it.

### Hand it to a template

`call` is a function template. The parameter type is whatever the lambda is. Passing "times two" and 6 produces 12. The template does not need a spelled-out name for the lambda type.

```cpp run expect="12" title="Template calls a lambda"
#include <iostream>
template <typename F>
int call(F fn, int x) { return fn(x); }
int main() {
  std::cout << call([](int n) { return n * 2; }, 6) << "\n";
  return 0;
}
```

Six times two is 12.

### Exercise: capture a factor

`factor` is 3 and is captured by value. The lambda multiplies its argument by that copy. Four times three is 12.

```cpp run expect="12" title="Multiply by the captured 3"
#include <iostream>
int main() {
  int factor = 3;
  auto scale = [factor](int n) { return n * factor; };
  std::cout << scale(4) << "\n";
  return 0;
}
```

Four times the captured 3 is 12.
