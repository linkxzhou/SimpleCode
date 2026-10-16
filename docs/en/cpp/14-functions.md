---
language: cpp
chapter: 14
title: "C++ Functions"
level: beginner
minutes: 8
goals:
  - "Write a function that returns a value"
  - "Change the caller through a reference"
  - "Give a parameter a default value"
sources:
  - learncpp
updated: "2026-10-16"
---

A function gives a calculation a name. A reference parameter names the caller's own variable, so an assignment inside the function changes that variable.

### A return value

`add` adds its two parameters and hands the sum back. `main` prints the value returned for 11 and 7.

```cpp run expect="18" title="Add"
#include <iostream>
int add(int a, int b) { return a + b; }
int main() {
  std::cout << add(11, 7) << "\n";
  return 0;
}
```

The returned sum is `18`.

### A reference parameter

`bump` adds one to the object bound to `n`. That object is the `n` declared in `main`, so it changes from 10 to 11.

```cpp run expect="11" title="Add one"
#include <iostream>
void bump(int &n) { n += 1; }
int main() {
  int n = 10;
  bump(n);
  std::cout << n << "\n";
  return 0;
}
```

After `bump`, `n` prints as `11`.

### A default argument

When the caller omits the second argument, the parameter is 1. Adding that default to 17 produces 18.

```cpp run expect="18" title="Omit one argument"
#include <iostream>
int add(int a, int b = 1) { return a + b; }
int main() {
  std::cout << add(17) << "\n";
  return 0;
}
```

The returned sum is `18`.
