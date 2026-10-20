---
language: c
chapter: 26
title: "C multidimensional arrays"
level: intermediate
minutes: 9
goals:
  - "Read one cell of a two-dimensional grid"
  - "Reach the same cell with pointer arithmetic"
  - "Point at a whole row"
sources:
  - cppreference
updated: "2026-10-20"
---

A two-dimensional array is still one contiguous run of elements. Rows sit back to back. The subscript form `a[r][c]` and a pointer offset name the same cell. The grids here are tiny so the lesson stays on layout, not on bounds.

### The last cell of row two

`grid` has two rows and three columns. Row two uses index 1, and its last column uses index 2. That cell holds 6.

```c run expect="6" title="Bottom-right cell"
#include <stdio.h>
int main(void) {
  int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
  printf("%d\n", grid[1][2]);
  return 0;
}
```

The bottom-right cell prints 6.

### Count forward from the row start

`p` addresses the first of `{4, 8, 1}`. `p + 2` steps over two ints, and the dereference reads 1. The step size is one element, not one byte.

```c run expect="1" title="Offset by two elements"
#include <stdio.h>
int main(void) {
  int row[3] = {4, 8, 1};
  int *p = row;
  printf("%d\n", *(p + 2));
  return 0;
}
```

The third element is 1.

### A pointer to an entire row

`int (*line)[3]` points at an array of three ints. Adding one would skip a whole row. Here it is aimed at row two of `grid`, then the first cell of that row is read.

```c run expect="4" title="Pointer to a row"
#include <stdio.h>
int main(void) {
  int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
  int (*line)[3] = &grid[1];
  printf("%d\n", (*line)[0]);
  return 0;
}
```

Row two starts at 4.

### Exercise: add one row

The first row holds 1, 2, and 3. Walk a pointer from the start of that row and add the cells. The loop index is also the offset, so there is no second subscript.

```c run expect="6" title="Sum of the first row"
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

The three cells add up to 6.
