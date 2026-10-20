---
language: cpp
chapter: 48
title: "C++ templates, further"
level: advanced
minutes: 10
goals:
  - "Specialize a function template for int"
  - "Add several ints with a parameter pack"
  - "Use a non-type parameter as a factor"
sources:
  - cppreference
  - modern-cpp-tutorial
updated: "2026-10-20"
---

Chapter 36 introduced the smallest function template. This chapter adds a specialization, a parameter pack, and a non-type parameter. The samples still use `int` only, so floating output never needs a format. A specialization must already be visible at the call.

### The int specialization adds one

The primary template returns its argument unchanged. The `int` specialization adds one. `id(4)` uses the specialization and returns 5.

```cpp run expect="5" title="Specialization adds one"
#include <iostream>
template <typename T>
T id(T value) { return value; }
template <>
int id<int>(int value) { return value + 1; }
int main() {
  std::cout << id(4) << "\n";
  return 0;
}
```

After the specialization the result is 5.

### Add a parameter pack

The recursive `add` consumes one `int` at a time. The overload with a single parameter returns that value. `add(1, 2, 4)` is 7.

```cpp run expect="7" title="Add three"
#include <iostream>
template <typename T>
T add(T value) { return value; }
template <typename T, typename... Rest>
T add(T value, Rest... rest) { return value + add(rest...); }
int main() {
  std::cout << add(1, 2, 4) << "\n";
  return 0;
}
```

One plus two plus four is 7.

### A non-type parameter

The `5` in `twice<5>()` is a compile-time constant, not a function argument. The body multiplies it by two and returns 10.

```cpp run expect="10" title="Compile-time 5"
#include <iostream>
template <int N>
int twice() { return N * 2; }
int main() {
  std::cout << twice<5>() << "\n";
  return 0;
}
```

Twice five is 10.

### Exercise: a class template that stores one number

`Hold<int>` stores 6. `get` returns it unchanged. The type argument is on the class name, so the object does not repeat `int`.

```cpp run expect="6" title="Class template"
#include <iostream>
template <typename T>
struct Hold {
  T value;
  T get() const { return value; }
};
int main() {
  Hold<int> box{6};
  std::cout << box.get() << "\n";
  return 0;
}
```

The stored value is 6.
