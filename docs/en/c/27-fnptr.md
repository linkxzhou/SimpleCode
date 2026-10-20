---
language: c
chapter: 27
title: "C function pointers"
level: intermediate
minutes: 9
goals:
  - "Pass a function into another function"
  - "Choose an operation from an array of pointers"
  - "Fold a list through a callback"
sources:
  - cppreference
updated: "2026-10-20"
---

Used apart from a call, a function name becomes a pointer. The receiver calls through that pointer and does not have to hard-code which function it is. Every sample stays in one file. Nothing is loaded dynamically.

### Hand it to apply

`twice` multiplies by two. The first parameter of `apply` is a pointer to a function that takes an int and returns an int. Passing `twice` and 5 produces 10.

```c run expect="10" title="Double it"
#include <stdio.h>
int twice(int n) { return n * 2; }
int apply(int (*fn)(int), int n) { return fn(n); }
int main(void) {
  printf("%d\n", apply(twice, 5));
  return 0;
}
```

Five through `twice` becomes 10.

### Pick an operation by index

`ops` stores addition first and subtraction second. Index 1 selects subtraction, and 9 minus 2 is 7. The call is written `ops[1](9, 2)`. The extra star is optional.

```c run expect="7" title="Subtraction selected"
#include <stdio.h>
int add(int x, int y) { return x + y; }
int sub(int x, int y) { return x - y; }
int main(void) {
  int (*ops[2])(int, int) = {add, sub};
  printf("%d\n", ops[1](9, 2));
  return 0;
}
```

The selected operation yields 7.

### A callback that adds

`fold` does not know the combining rule. It only hands each array element to the callback. `add_into` adds the element into the running total. One, two, and four make seven.

```c run expect="7" title="Sum through a callback"
#include <stdio.h>
int add_into(int acc, int n) { return acc + n; }
int fold(const int *a, int n, int (*fn)(int, int)) {
  int acc = 0;
  int i;
  for (i = 0; i < n; i++) acc = fn(acc, a[i]);
  return acc;
}
int main(void) {
  int a[3] = {1, 2, 4};
  printf("%d\n", fold(a, 3, add_into));
  return 0;
}
```

After three callbacks the total is 7.

### Exercise: keep the larger value

`pick` chooses between functions supplied by the caller. With `larger`, the pair 8 and 3 keeps 8. Swapping the function would not require a change inside `pick`. This exercise compares once.

```c run expect="8" title="Keep the larger value"
#include <stdio.h>
int larger(int x, int y) { return x > y ? x : y; }
int pick(int (*fn)(int, int), int x, int y) { return fn(x, y); }
int main(void) {
  printf("%d\n", pick(larger, 8, 3));
  return 0;
}
```

The larger value is 8.
