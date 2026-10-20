---
language: cpp
chapter: 49
title: "C++ leave values unchanged on failure"
level: advanced
minutes: 10
goals:
  - "Keep the old quantity when a move cannot happen"
  - "Update both fields together when it can"
  - "Clear a flag from a destructor"
sources:
  - cppreference
updated: "2026-10-20"
---

Exception safety asks whether an object is still whole after a failure. This clang builds with exceptions disabled, so `throw` does not compile. The same promise can be made with a return code: a failed check writes nothing, and a passed check writes both fields. A destructor still clears a temporary flag.

### Not enough, so do not move

`tea` holds 4, and moving 9 fails. The function returns 1 and does not change `tea`. The line is `fail 4`.

```cpp run expect="fail 4" title="Refuse when short"
#include <iostream>
int move_qty(int *src, int *dst, int n) {
  if (n < 0 || *src < n) return 1;
  *src -= n;
  *dst += n;
  return 0;
}
int main() {
  int tea = 4;
  int cup = 1;
  int rc = move_qty(&tea, &cup, 9);
  std::cout << (rc ? "fail " : "ok ") << tea << "\n";
  return 0;
}
```

After the failure tea is still 4.

### Enough, so change both sides

Moving 3 from 4 leaves tea at 1 and would raise cup from 1 to 4. This listing prints tea, which shows the source decreased. The return code is 0, so the prefix is `ok`.

```cpp run expect="ok 1" title="Move succeeds"
#include <iostream>
int move_qty(int *src, int *dst, int n) {
  if (n < 0 || *src < n) return 1;
  *src -= n;
  *dst += n;
  return 0;
}
int main() {
  int tea = 4;
  int cup = 1;
  int rc = move_qty(&tea, &cup, 3);
  std::cout << (rc ? "fail " : "ok ") << tea << "\n";
  return 0;
}
```

After success tea is 1.

### Leaving the scope clears the flag

`Flag` stores 1 in the slot on construction and 0 in the destructor. After the inner block the slot is 0. That stands in for "unlock even if something fails". There is no exception, and the destructor still runs.

```cpp run expect="0" title="Destructor clears the flag"
#include <iostream>
struct Flag {
  int *slot;
  Flag(int *p) : slot(p) { *slot = 1; }
  ~Flag() { *slot = 0; }
};
int main() {
  int slot = 0;
  {
    Flag guard(&slot);
  }
  std::cout << slot << "\n";
  return 0;
}
```

After the block the flag is 0.

### Exercise: throw does not compile

The `try` / `throw` below fails on a compiler with exceptions disabled. The return codes above are the stand-in for a strong guarantee. This listing is not run.

Effective C++ has items about exception guarantees. The text is not copied: https://book.douban.com/subject/1842426 .

```cpp norun title="Exceptions are disabled"
#include <iostream>
int main() {
  try {
    throw 1;
  } catch (int x) {
    std::cout << x << "\n";
  }
  return 0;
}
```

The `throw` in the reading block is not compiled.
