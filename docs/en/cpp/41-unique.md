---
language: cpp
chapter: 41
title: "C++ unique_ptr"
level: intermediate
minutes: 10
goals:
  - "Own one heap int with unique_ptr"
  - "Create it with make_unique"
  - "See the source become empty after a move"
sources:
  - cppreference
  - modern-cpp-tutorial
updated: "2026-10-20"
---

A `unique_ptr` owns one heap block and `delete`s it when the owner leaves scope. Only one owner exists at a time. This clang crashes in code generation when it compiles `shared_ptr`, so shared ownership stays as a reading-only listing. Every runnable sample uses `unique_ptr`.

### Seven on the heap

`new int(7)` is given to a `unique_ptr`. Dereferencing it reads 7. When `main` ends, the pointer's destructor runs. There is no handwritten `delete`.

```cpp run expect="7" title="Exclusive 7"
#include <iostream>
#include <memory>
int main() {
  std::unique_ptr<int> slot(new int(7));
  std::cout << *slot << "\n";
  return 0;
}
```

The stored value is 7.

### make_unique

`make_unique<int>(11)` is available in C++14 and avoids a separate `new`. The value inside is 11.

```cpp run expect="11" title="make_unique"
#include <iostream>
#include <memory>
int main() {
  auto slot = std::make_unique<int>(11);
  std::cout << *slot << "\n";
  return 0;
}
```

The value is 11.

### Empty after the move

`std::move` gives ownership to `kept`. The original `slot` becomes empty. The program prints the 7 inside `kept`, then whether `slot` is non-empty. Empty prints 0, so the line is `70`.

```cpp run expect="70" title="Empty after move"
#include <iostream>
#include <memory>
#include <utility>
int main() {
  std::unique_ptr<int> slot(new int(7));
  std::unique_ptr<int> kept(std::move(slot));
  std::cout << *kept << (slot ? 1 : 0) << "\n";
  return 0;
}
```

The line `70` means the value remains and the original pointer is empty.

### Exercise: a field on a struct

`Item` has a single `price`. `make_unique<Item>()` default-constructs it, then the field is set to 4. The `shared_ptr` shape below is not run.

```cpp norun title="shared_ptr crashes this compiler"
#include <memory>
int main() {
  std::shared_ptr<int> slot = std::make_shared<int>(8);
  return *slot;
}
```

```cpp run expect="4" title="Field is 4"
#include <iostream>
#include <memory>
struct Item {
  int price;
};
int main() {
  auto item = std::make_unique<Item>();
  item->price = 4;
  std::cout << item->price << "\n";
  return 0;
}
```

The field is 4.
