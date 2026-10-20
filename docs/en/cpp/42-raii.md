---
language: cpp
chapter: 42
title: "C++ RAII"
level: intermediate
minutes: 9
goals:
  - "Acquire in the constructor and release in the destructor"
  - "Watch two objects destroy in reverse order"
  - "Still destroy on an early return"
sources:
  - cppreference
updated: "2026-10-20"
---

RAII ties a resource to an object's lifetime. The constructor acquires it and the destructor releases it. A local object is destroyed when its scope ends, including an early `return`. Printing stands in for a lock or a file, because this runtime has no file streams worth exercising.

### Open, then shut

`Gate` prints `open` in the constructor and `shut` in the destructor. The statement in between prints `work`. The order is constructor, body, destructor.

```cpp run expect="open work shut" title="Paired open and shut"
#include <iostream>
struct Gate {
  Gate() { std::cout << "open "; }
  ~Gate() { std::cout << "shut"; }
};
int main() {
  Gate gate;
  std::cout << "work ";
  return 0;
}
```

The line is `open work shut`.

### The later object is destroyed first

The first object is numbered 1 and the second is numbered 2. Leaving `main` destroys 2, then 1. The four digits together are `1221`.

```cpp run expect="1221" title="Destruction reverses construction"
#include <iostream>
struct Mark {
  int id;
  Mark(int value) : id(value) { std::cout << id; }
  ~Mark() { std::cout << id; }
};
int main() {
  Mark first(1);
  Mark second(2);
  return 0;
}
```

The line is `1221`.

### An early return still destroys

`work` constructs a `Gate` and then `return`s immediately. The destructor still runs, so `shut` is present. The caller prints a dot after the call, which shows that destruction happened inside the function.

```cpp run expect="open shut." title="Destroy before return finishes"
#include <iostream>
struct Gate {
  Gate() { std::cout << "open "; }
  ~Gate() { std::cout << "shut"; }
};
void work() {
  Gate gate;
  return;
}
int main() {
  work();
  std::cout << ".\n";
  return 0;
}
```

`shut` appears before the dot.

### Exercise: how many are alive

`Live::count` increases in the constructor and decreases in the destructor. The inner block holds two objects, so the count is 2. After the block it is 0. The two lines are `2` and `0`.

```cpp run expect="2\n0" title="Back to zero outside"
#include <iostream>
struct Live {
  static int count;
  Live() { count++; }
  ~Live() { count--; }
};
int Live::count = 0;
int main() {
  {
    Live left;
    Live right;
    std::cout << Live::count << "\n";
  }
  std::cout << Live::count << "\n";
  return 0;
}
```

Inside the block the count is 2. Outside it is 0.
