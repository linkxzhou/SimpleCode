---
language: c
chapter: 4
title: "C Variables"
level: beginner
minutes: 8
goals:
  - "Declare a name before you use it"
  - "Initialize each local variable"
  - "Do not print an uninitialized value"
sources:
  - learn-c
updated: "2026-10-16"
---

Assign a local variable before you read it. Every variable in this book receives a value before it is used.

### Declare and assign

The type is written in front of the name. `price` is an `int` set to 18, and `%d` prints it.

```c run expect="18" title="Unit price"
#include <stdio.h>
int main(void) {
  int price = 18;
  printf("%d\n", price);
  return 0;
}
```

The output contains `18`.

### Assign again

The same name can receive a new value later in the function. `n` starts at 1 and is then set to 4.

```c run expect="4" title="Change to 4"
#include <stdio.h>
int main(void) {
  int n = 1;
  n = 4;
  printf("%d\n", n);
  return 0;
}
```

The output contains `4`.

### Single quotes for a character

Single quotes hold one character, here `'A'`. Double quotes hold a string, and `%c` prints the character in `c`.

```c run expect="A" title="One character"
#include <stdio.h>
int main(void) {
  char c = 'A';
  printf("%c\n", c);
  return 0;
}
```

The output contains `A`.
