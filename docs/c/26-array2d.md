---
language: c
chapter: 26
title: "C 多维数组与指针"
level: intermediate
minutes: 9
goals:
  - "按下标读出二维格子"
  - "用指针偏移访问同一行"
  - "把一整行交给指向数组的指针"
sources:
  - cppreference
updated: "2026-10-20"
---

二维数组在内存里仍是连续的一排元素，行与行首尾相接。下标 `a[r][c]` 和指针偏移指的是同一块格子，只是写法不同。这一章的表很小，避免和越界混在一起。

### 第二行的末格

`grid` 有两行三列。第二行下标是 1，该行最后一列下标是 2，格子里放着 6。

```c run expect="6" title="右下角"
#include <stdio.h>
int main(void) {
  int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
  printf("%d\n", grid[1][2]);
  return 0;
}
```

右下角打印 6。

### 从行首往后数

`p` 指向 `{4, 8, 1}` 的开头。`p + 2` 越过两个 `int`，解引用得到最后一格的 1。这里的步长是元素，不是字节。

```c run expect="1" title="偏移两个元素"
#include <stdio.h>
int main(void) {
  int row[3] = {4, 8, 1};
  int *p = row;
  printf("%d\n", *(p + 2));
  return 0;
}
```

第三个元素是 1。

### 指向一行的指针

`int (*line)[3]` 指向「含 3 个 int 的数组」，加一就会跳过整行。下面让它指向 `grid` 的第二行，再取该行第一格。

```c run expect="4" title="整行指针"
#include <stdio.h>
int main(void) {
  int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
  int (*line)[3] = &grid[1];
  printf("%d\n", (*line)[0]);
  return 0;
}
```

第二行开头是 4。

### 练习：把一行加总

第一行是 1、2、3。用指针从行首走到行尾，累加得到 6。循环变量同时充当偏移，没有多余的下标。

```c run expect="6" title="第一行之和"
#include <stdio.h>
int main(void) {
  int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
  int *p = &grid[0][0];
  int sum = 0;
  int i;
  for (i = 0; i < 3; i++) sum += *(p + i);
  printf("%d\n", sum);
  return 0;
}
```

三格相加是 6。
