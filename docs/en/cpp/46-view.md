---
language: cpp
chapter: 46
title: "C++ string_view"
level: advanced
minutes: 10
goals:
  - "Look at characters through a string_view"
  - "Take a prefix without copying the whole string"
  - "Stand in for optional with a small Maybe type"
sources:
  - cppreference
updated: "2026-10-20"
---

`string_view` is available in this C++14 libc++. It stores a pointer and a length and does not own the characters. `std::optional` needs C++17. Under this standard the header does not declare it, so a tiny type that holds an `int` shows the idea of a missing value.

### The length is 3

A `string_view` of `"tea"` has length 3. It does not allocate a new buffer.

```cpp run expect="3" title="Length of tea"
#include <iostream>
#include <string_view>
int main() {
  std::string_view word("tea");
  std::cout << word.size() << "\n";
  return 0;
}
```

The length is 3.

### The first three characters

The prefix of `"teapot"` has length 3. `substr` still returns a view, and `size` is taken from that view.

```cpp run expect="3" title="Prefix length"
#include <iostream>
#include <string_view>
int main() {
  std::string_view word("teapot");
  std::cout << word.substr(0, 3).size() << "\n";
  return 0;
}
```

The prefix length is 3.

### Two views compare equal

Both `string_view` values point at the literal `"tea"`. Equality compares characters, not whether the pointers are identical. A match prints `yes`.

```cpp run expect="yes" title="Same characters"
#include <iostream>
#include <string_view>
int main() {
  std::string_view left("tea");
  std::string_view right("tea");
  std::cout << (left == right ? "yes" : "no") << "\n";
  return 0;
}
```

The characters match, so the line is `yes`.

### Exercise: 8 inside Maybe

`Maybe` uses `ok` to say whether a value is present. When it is present, `get` returns 8. The `std::optional` spelling stays in a reading-only block. This compiler reports it as undeclared.

C++ Primer places `optional` in a later standard. Only the catalog link is kept: https://book.douban.com/subject/25708312 .

```cpp norun title="optional needs C++17"
#include <optional>
int main() {
  std::optional<int> slot(4);
  return *slot;
}
```

```cpp run expect="8" title="Read it when present"
#include <iostream>
struct Maybe {
  int value;
  bool ok;
  int get() const { return ok ? value : 0; }
};
int main() {
  Maybe slot{8, true};
  std::cout << slot.get() << "\n";
  return 0;
}
```

The stored value is 8.
