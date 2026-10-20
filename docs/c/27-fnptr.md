---
language: c
chapter: 27
title: "C 函数指针"
level: intermediate
minutes: 9
goals:
  - "把函数交给另一个函数调用"
  - "在函数指针数组里按序号挑选"
  - "用回调处理一组整数"
sources:
  - cppreference
updated: "2026-10-20"
---

函数名在调用之外会变成函数指针。接收方通过这个指针调用，不必在编译期写死是哪一个函数。例子都放在同一个文件里，没有动态加载。

### 交给 apply

`twice` 把参数乘 2。`apply` 的第一个参数是「接收 int、返回 int」的函数指针。传入 `twice` 和 5，得到 10。

```c run expect="10" title="乘二"
#include <stdio.h>
int twice(int n) { return n * 2; }
int apply(int (*fn)(int), int n) { return fn(n); }
int main(void) {
  printf("%d\n", apply(twice, 5));
  return 0;
}
```

5 经过 twice 变成 10。

### 按序号选运算

`ops` 里先放加法，再放减法。下标 1 选中减法，9 减 2 得到 7。调用写成 `ops[1](9, 2)`，星号可以省略。

```c run expect="7" title="选中减法"
#include <stdio.h>
int add(int x, int y) { return x + y; }
int sub(int x, int y) { return x - y; }
int main(void) {
  int (*ops[2])(int, int) = {add, sub};
  printf("%d\n", ops[1](9, 2));
  return 0;
}
```

选中的运算得到 7。

### 回调累加

`fold` 不知道具体怎么合并，只负责把数组里的每个数交给回调。`add_into` 把当前元素加进累计值。1、2、4 加在一起是 7。

```c run expect="7" title="回调求和"
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

三次回调之后是 7。

### 练习：挑选较大值

`pick` 在两个函数之间选择。传入 `larger` 时，8 和 3 里留下 8。换一个函数不必改 `pick` 的循环，这一题只有一次比较。

```c run expect="8" title="留下较大的"
#include <stdio.h>
int larger(int x, int y) { return x > y ? x : y; }
int pick(int (*fn)(int, int), int x, int y) { return fn(x, y); }
int main(void) {
  printf("%d\n", pick(larger, 8, 3));
  return 0;
}
```

较大的是 8。
