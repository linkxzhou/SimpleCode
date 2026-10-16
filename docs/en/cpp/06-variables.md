---
language: cpp
chapter: 6
title: "C++ Variables"
level: beginner
minutes: 8
goals:
  - "Declare a name before you use it"
  - "Give every local variable an initial value"
  - "Assign a new value to the same name"
sources:
  - learncpp
updated: "2026-10-16"
---

Give a local variable a value before you read it. A name that is never used fails this compile.

### Declare and initialize

The type is written in front of the name. `price` starts at 18 and is printed at once.

```cpp run expect="18" title="Unit price"
#include <iostream>
int main() {
  int price = 18;
  std::cout << price << "\n";
  return 0;
}
```

That run shows `18`.

### Assign again

A later assignment replaces the stored number. `n` begins as 1 and then becomes 4.

```cpp run expect="4" title="Change to 4"
#include <iostream>
int main() {
  int n = 1;
  n = 4;
  std::cout << n << "\n";
  return 0;
}
```

That run shows `4`.

### Single quotes for one character

Single quotes hold one character. Double quotes hold a string. `mark` is the character `B`.

```cpp run expect="B" title="One character"
#include <iostream>
int main() {
  char mark = 'B';
  std::cout << mark << "\n";
  return 0;
}
```

That run shows `B`.
