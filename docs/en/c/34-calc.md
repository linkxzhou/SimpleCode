---
language: c
chapter: 34
title: "C a small calculator"
level: intermediate
minutes: 10
goals:
  - "Split two ints and an operator with sscanf"
  - "Add, subtract, or multiply from that operator"
  - "Return 0 for an operator that is not supported"
sources:
  - cppreference
updated: "2026-10-20"
---

This calculator accepts only "integer, one operator, integer". There are no spaces and no parentheses. The expression is a string, split by `sscanf`. It is not a full expression parser. Division and negative numbers stay out of the chapter.

### Twelve plus thirty

`"12+30"` splits into 12, `+`, and 30. `apply` sees the plus sign and adds, which is 42.

```c run expect="42" title="12+30"
#include <stdio.h>
int apply(int left, char op, int right) {
  if (op == '+') return left + right;
  if (op == '-') return left - right;
  if (op == '*') return left * right;
  return 0;
}
int main(void) {
  int left = 0;
  int right = 0;
  char op = 0;
  sscanf("12+30", "%d%c%d", &left, &op, &right);
  printf("%d\n", apply(left, op, right));
  return 0;
}
```

Twelve plus thirty is 42.

### Twenty minus eight

The same split reads `"20-8"`. The minus branch returns 12. The return value of `sscanf` is not checked, because the literal has a fixed shape.

```c run expect="12" title="20-8"
#include <stdio.h>
int apply(int left, char op, int right) {
  if (op == '+') return left + right;
  if (op == '-') return left - right;
  if (op == '*') return left * right;
  return 0;
}
int main(void) {
  int left = 0;
  int right = 0;
  char op = 0;
  sscanf("20-8", "%d%c%d", &left, &op, &right);
  printf("%d\n", apply(left, op, right));
  return 0;
}
```

Twenty minus eight is 12.

### Six times seven

The star takes the third branch. Six times seven is 42. The add and subtract branches remain, and this character matches neither of them.

```c run expect="42" title="6*7"
#include <stdio.h>
int apply(int left, char op, int right) {
  if (op == '+') return left + right;
  if (op == '-') return left - right;
  if (op == '*') return left * right;
  return 0;
}
int main(void) {
  int left = 0;
  int right = 0;
  char op = 0;
  sscanf("6*7", "%d%c%d", &left, &op, &right);
  printf("%d\n", apply(left, op, right));
  return 0;
}
```

Six times seven is 42.

### Exercise: an unrecognized sign

The slash in `"9/3"` matches none of the three branches, so `apply` returns 0. That is a refusal, not a division.

```c run expect="0" title="Slash is not computed"
#include <stdio.h>
int apply(int left, char op, int right) {
  if (op == '+') return left + right;
  if (op == '-') return left - right;
  if (op == '*') return left * right;
  return 0;
}
int main(void) {
  int left = 0;
  int right = 0;
  char op = 0;
  sscanf("9/3", "%d%c%d", &left, &op, &right);
  printf("%d\n", apply(left, op, right));
  return 0;
}
```

An unsupported operator produces 0.
