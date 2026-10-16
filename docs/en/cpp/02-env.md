---
language: cpp
chapter: 2
title: "C++ Environment Setup"
level: beginner
minutes: 8
goals:
  - "Expect the button to invoke clang"
  - "Use every variable you declare"
  - "Keep the g++ command out of the source"
sources:
  - learncpp
updated: "2026-10-16"
---

The Run button is what compiles the page. The file itself should contain C++ statements only. An unused name becomes a warning, and a warning stops this build.

### A line that builds

This file mentions `price` and then prints it, so nothing is left unused for the warning check to reject.

```cpp run expect="18" title="Unit price"
#include <iostream>
int main() {
  int price = 18;
  std::cout << price << "\n";
  return 0;
}
```

You get `18` on the line.

### The dialect stays near C++14

This clang 8 is close to gnu++14 by default. The samples skip structured bindings and `std::optional`. `auto` can still deduce the type of a plain integer.

```cpp run expect="18" title="Deduce with auto"
#include <iostream>
int main() {
  auto price = 18;
  std::cout << price << "\n";
  return 0;
}
```

You get `18` on the line.

### A shell line is not a program

`g++` is typed in a terminal. Pasting it into a `.cpp` file does not ask the compiler to build some other source.

```cpp norun title="Not a C++ statement"
g++ main.cpp -o main
```
