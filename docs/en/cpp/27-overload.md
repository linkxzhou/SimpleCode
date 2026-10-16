---
language: cpp
chapter: 27
title: "C++ Overloading"
level: beginner
minutes: 8
goals:
  - "Distinguish one name by how many parameters it takes"
  - "Add two objects with an operator"
  - "Remember that the return type alone does not overload"
sources:
  - learncpp
updated: "2026-10-16"
---

Overload resolution looks at the parameters. It does not look at the return type. Two functions may share a name when their parameter lists differ.

### How many parameters

The one-argument `span` returns that argument. The two-argument `span` returns the sum. The calls print 3 and 7.

```cpp run expect="3 7" title="Two calls"
#include <iostream>
int span(int w) { return w; }
int span(int w, int h) { return w + h; }
int main() {
  std::cout << span(3) << " " << span(3, 4) << "\n";
  return 0;
}
```

The selected results are `3 7`.

### An operator

`operator+` adds two `Pair` values field by field. `1 + 3` and `2 + 4` produce the pair 4, 6.

```cpp run expect="4 6" title="Add the fields"
#include <iostream>
struct Pair { int a; int b; };
Pair operator+(Pair x, Pair y) {
  Pair z;
  z.a = x.a + y.a;
  z.b = x.b + y.b;
  return z;
}
int main() {
  Pair left{1, 2};
  Pair right{3, 4};
  Pair sum = left + right;
  std::cout << sum.a << " " << sum.b << "\n";
  return 0;
}
```

The selected results are `4 6`.

### The call names the overload

Two integer arguments select the second `area`, which multiplies width by height. `area(3, 5)` is 15.

```cpp run expect="15" title="Rectangle"
#include <iostream>
int area(int w) { return w * w; }
int area(int w, int h) { return w * h; }
int main() {
  std::cout << area(3, 5) << "\n";
  return 0;
}
```

The selected results are `15`.
