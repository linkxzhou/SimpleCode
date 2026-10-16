---
language: cpp
chapter: 32
title: "C++ Files and Streams"
level: beginner
minutes: 8
goals:
  - "Expect no reliable disk path in this runtime"
  - "Prepare a line with ostringstream"
  - "Read a number back with istringstream"
sources:
  - learncpp
updated: "2026-10-16"
---

A file stream can open a path on a normal machine. The program produced here does not depend on your disk. String streams stand in for the same `<<` and `>>` operations.

### ofstream is for reading only

No real path is guaranteed in this environment. The listing shows the shape of an `ofstream`, and the runner skips it.

```cpp norun title="Do not touch the disk"
#include <fstream>
int main() {
  std::ofstream out("note.txt");
  out << "茶\n";
  return 0;
}
```

### Write into a string stream

`ostringstream` builds the line in memory. The characters are `茶`, a space, and 18.

```cpp run expect="茶 18" title="One line of text"
#include <iostream>
#include <sstream>
int main() {
  std::ostringstream out;
  out << "茶 " << 18;
  std::cout << out.str() << "\n";
  return 0;
}
```

The in-memory line is `茶 18`.

### Read it back

`istringstream` pulls an integer out of that text, stopping at whitespace. The text `"18"` yields the number 18.

```cpp run expect="18" title="Read it back"
#include <iostream>
#include <sstream>
int main() {
  std::istringstream in("18");
  int n = 0;
  in >> n;
  std::cout << n << "\n";
  return 0;
}
```

The extracted integer is `18`.
