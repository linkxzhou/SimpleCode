---
language: c
chapter: 34
title: "C 小计算器"
level: intermediate
minutes: 10
goals:
  - "用 sscanf 拆开两个整数和一个运算符"
  - "按运算符做加、减、乘"
  - "不认识的运算符返回 0"
sources:
  - cppreference
updated: "2026-10-20"
---

这个小计算器只处理「整数、一个运算符、整数」，没有空格，也没有括号。算式写在字符串里，用 `sscanf` 拆开。它不是完整的表达式求值器，除法和负数都不在这一章。

### 十二加三十

`"12+30"` 被拆成 12、`+`、30。`apply` 看到加号就相加，得到 42。

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

12 加 30 是 42。

### 二十减八

同一拆法用于 `"20-8"`。减号分支返回 12。`sscanf` 的返回值这里不检查，因为字面量的形状是固定的。

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

20 减 8 是 12。

### 六乘七

乘号走第三条分支。6 乘 7 是 42。加法和减法的分支仍然留着，只是这次字符对不上。

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

6 乘 7 是 42。

### 练习：不认识的符号

`"9/3"` 里的斜线不在三条分支里，`apply` 返回 0。这不是做了除法，而是拒绝了这个运算符。

```c run expect="0" title="斜线不计算"
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

不支持的运算符得到 0。
