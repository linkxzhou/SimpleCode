---
language: c
chapter: 31
title: "C qsort and bsearch"
level: intermediate
minutes: 9
goals:
  - "Order ints with a comparison function"
  - "Binary-search an array that is already ordered"
  - "Treat a missing key as a null pointer"
sources:
  - cppreference
updated: "2026-10-20"
---

`qsort` and `bsearch` live in `stdlib.h`. The comparison function receives two `const void *` values and casts them to `int` before subtracting. `bsearch` requires the array to be ordered by that same function. Otherwise the result is meaningless.

### The smallest value moves first

The array starts as 3, 1, 2. Subtracting the left value from the right would reverse the order. This comparator subtracts the right from the left, so the order is ascending. After the sort the first element is 1.

```c run expect="1" title="Start of ascending order"
#include <stdio.h>
#include <stdlib.h>
int by_int(const void *left, const void *right) {
  const int *a = left;
  const int *b = right;
  return *a - *b;
}
int main(void) {
  int a[3] = {3, 1, 2};
  qsort(a, 3, sizeof a[0], by_int);
  printf("%d\n", a[0]);
  return 0;
}
```

The first element after sorting is 1.

### Print all three

The same numbers sort into 1 2 3. Reading every index shows that the middle moved too, not only the first cell.

```c run expect="1 2 3" title="The whole ascending row"
#include <stdio.h>
#include <stdlib.h>
int by_int(const void *left, const void *right) {
  const int *a = left;
  const int *b = right;
  return *a - *b;
}
int main(void) {
  int a[3] = {3, 1, 2};
  qsort(a, 3, sizeof a[0], by_int);
  printf("%d %d %d\n", a[0], a[1], a[2]);
  return 0;
}
```

The line is `1 2 3`.

### Two is present

The array is sorted into 1, 2, 3, then 2 is sought. `bsearch` returns a pointer to that element. Dereferencing it still yields 2.

```c run expect="2" title="Found 2"
#include <stdio.h>
#include <stdlib.h>
int by_int(const void *left, const void *right) {
  const int *a = left;
  const int *b = right;
  return *a - *b;
}
int main(void) {
  int a[3] = {3, 1, 2};
  int key = 2;
  int *found;
  qsort(a, 3, sizeof a[0], by_int);
  found = bsearch(&key, a, 3, sizeof a[0], by_int);
  printf("%d\n", found ? *found : 0);
  return 0;
}
```

The found value is 2.

### Exercise: eight is absent

The same array does not contain 8. `bsearch` returns a null pointer. The program prints `no` and does not dereference it.

```c run expect="no" title="Missing key"
#include <stdio.h>
#include <stdlib.h>
int by_int(const void *left, const void *right) {
  const int *a = left;
  const int *b = right;
  return *a - *b;
}
int main(void) {
  int a[3] = {3, 1, 2};
  int key = 8;
  int *found;
  qsort(a, 3, sizeof a[0], by_int);
  found = bsearch(&key, a, 3, sizeof a[0], by_int);
  printf("%s\n", found ? "yes" : "no");
  return 0;
}
```

The key is absent, so the line is `no`.
