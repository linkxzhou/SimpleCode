---
language: c
chapter: 31
title: "C qsort 与 bsearch"
level: intermediate
minutes: 9
goals:
  - "用比较函数把整数排好"
  - "在已排序的数组里二分查找"
  - "找不到时认下空指针"
sources:
  - cppreference
updated: "2026-10-20"
---

`qsort` 和 `bsearch` 都在 `stdlib.h` 里。比较函数收到两个 `const void *`，自己转换成 `int` 再相减。`bsearch` 要求数组已经按同一个比较函数排好，否则结果没有意义。

### 最小的排到前面

数组开始是 3、1、2。`by_int` 用右边减左边会得到相反的次序，这里用左边减右边，升序。排完后第一个元素是 1。

```c run expect="1" title="升序的开头"
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

排完的第一个是 1。

### 三个都打出来

同一组数排完是 1 2 3。三个下标都读一次，避免只看开头就以为中间没动。

```c run expect="1 2 3" title="整行升序"
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

一行是 `1 2 3`。

### 找得到 2

数组先排成 1、2、3，再查找 2。`bsearch` 返回指向该元素的指针，解引用仍是 2。

```c run expect="2" title="找到 2"
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

找到的值是 2。

### 练习：没有 8

同一数组里没有 8。`bsearch` 返回空指针，程序打印 `no`，不去解引用。

```c run expect="no" title="没有这个键"
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

键不存在，所以是 `no`。
