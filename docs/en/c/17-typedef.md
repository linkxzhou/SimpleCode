---
language: c
chapter: 17
title: "C typedef"
level: beginner
minutes: 8
goals:
  - "Give a type a short name"
  - "Name a structure"
  - "Name a function pointer"
sources:
  - learn-c
updated: "2026-10-16"
---

`typedef` does not create a new operation. It only attaches another name to a type that already exists.

### An alias for int

`Price` is another name for `int`, and the two can hold the same values. `p` is set to 18 and printed with `%d`.

```c run expect="18" title="Unit price"
#include <stdio.h>
typedef int Price;
int main(void) {
  Price p = 18;
  printf("%d\n", p);
  return 0;
}
```

The output contains `18`.

### An alias for a structure

The name `Item` stands for the whole structure type. Declaring `it` does not repeat the keyword `struct`, and `it.price` is set to 6.

```c run expect="6" title="Short name"
#include <stdio.h>
typedef struct { int price; } Item;
int main(void) {
  Item it;
  it.price = 6;
  printf("%d\n", it.price);
  return 0;
}
```

The output contains `6`.

### A function pointer

`Bin` names a pointer to a function of two `int` parameters that returns an `int`. The call `f(2, 3)` is still an ordinary call.

```c run expect="5" title="Call through the alias"
#include <stdio.h>
typedef int (*Bin)(int, int);
int add(int a, int b) { return a + b; }
int main(void) {
  Bin f = add;
  printf("%d\n", f(2, 3));
  return 0;
}
```

The output contains `5`.
