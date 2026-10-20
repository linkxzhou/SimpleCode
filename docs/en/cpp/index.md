---
language: cpp
chapter: 0
title: "C++ Tutorial"
minutes: 8
goals:
  - "Print one line with std::cout"
  - "Return 0 from main"
  - "Keep sort and throw out of runnable samples"
sources:
  - learncpp
updated: "2026-10-16"
---

Every listing in this book is compiled as C++ and linked with libc++. Each sample is a single file. `std::sort` and `throw` stay in reading-only blocks, because the first fails to link and the second is unstable on this runtime.

### The first line

`std::cout` does not start a new line by itself. The `\n` has to sit inside the string you send.

```cpp run expect="Hi" title="Say hello"
#include <iostream>
int main() {
  std::cout << "Hi\n";
  return 0;
}
```

The printed text is `Hi`.

### Return zero

A `main` that returns 0 finished in the ordinary way. This sample writes that status, then returns it.

```cpp run expect="0" title="Normal finish"
#include <iostream>
int main() {
  std::cout << 0 << "\n";
  return 0;
}
```

The printed text is `0`.

### Two limits

Linking `std::sort` demands `__lttf2`, and this toolchain does not provide it. `throw` is also unfit to execute here, so the page leaves the listing unread by the runner.

```cpp norun title="Sort and throw"
#include <algorithm>
#include <vector>
int main() {
  std::vector<int> v{3, 1};
  std::sort(v.begin(), v.end());
  throw 1;
  return 0;
}
```

### After chapter 39

`auto`, range-for, lambdas, `unique_ptr`, RAII, move, algorithms that do not sort, `map`, `string_view`, `constexpr`, template specialization, and an in-memory inventory follow the STL chapter. `std::sort` and `throw` still do not run. `shared_ptr` crashes this clang while compiling, and `optional` needs C++17, so both stay as reading.
