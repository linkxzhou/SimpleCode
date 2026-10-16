---
language: c
chapter: 14
title: "C Structures"
level: beginner
minutes: 8
goals:
  - "Group fields in a struct"
  - "Read a field with the dot"
  - "Read a field through a pointer with the arrow"
sources:
  - learn-c
updated: "2026-10-16"
---

A structure gathers several fields into one type. Each field keeps its own name and type.

### The dot operator

A dot after a structure variable selects a field. `it.price` is set to 18 and then printed.

```c run expect="18" title="Unit price"
#include <stdio.h>
struct Item { int price; };
int main(void) {
  struct Item it;
  it.price = 18;
  printf("%d\n", it.price);
  return 0;
}
```

The output contains `18`.

### Initialization

Values in the brace list follow the field order. `{18}` fills `price`, the only field of `Item`.

```c run expect="18" title="Initial value"
#include <stdio.h>
struct Item { int price; };
int main(void) {
  struct Item it = {18};
  printf("%d\n", it.price);
  return 0;
}
```

The output contains `18`.

### The arrow operator

When a pointer addresses a structure, use `->` in place of a dot. `p` points at `it`, so `p->price` reads 18.

```c run expect="18" title="Through a pointer"
#include <stdio.h>
struct Item { int price; };
int main(void) {
  struct Item it = {18};
  struct Item *p = &it;
  printf("%d\n", p->price);
  return 0;
}
```

The output contains `18`.
