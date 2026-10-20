---
language: c
chapter: 30
title: "C 可变参数"
level: intermediate
minutes: 9
goals:
  - "用 va_list 依次取出 int"
  - "在不定个数里找最大"
  - "让调用方传入个数"
sources:
  - cppreference
updated: "2026-10-20"
---

`stdarg.h` 让函数在固定参数之后再收一批同类型的实参。这批实参没有数组长度，所以调用方必须另传一个个数。取完要 `va_end`。下面只传 `int`，不要把 `float` 塞进来，默认提升会把它变成 `double`。

### 三个数相加

`sum` 的第一个参数是个数。`va_start` 之后循环三次，依次取出 1、2、4。和是 7。

```c run expect="7" title="1+2+4"
#include <stdio.h>
#include <stdarg.h>
int sum(int n, ...) {
  va_list ap;
  int total = 0;
  int i;
  va_start(ap, n);
  for (i = 0; i < n; i++) total += va_arg(ap, int);
  va_end(ap);
  return total;
}
int main(void) {
  printf("%d\n", sum(3, 1, 2, 4));
  return 0;
}
```

三数之和是 7。

### 留下最大的

先取出第一个当作当前最大，再和后面的比较。3、9、2 里最大是 9。个数仍然由调用方保证，函数自己不会数实参。

```c run expect="9" title="最大是 9"
#include <stdio.h>
#include <stdarg.h>
int biggest(int n, ...) {
  va_list ap;
  int best;
  int i;
  va_start(ap, n);
  best = va_arg(ap, int);
  for (i = 1; i < n; i++) {
    int value = va_arg(ap, int);
    if (value > best) best = value;
  }
  va_end(ap);
  return best;
}
int main(void) {
  printf("%d\n", biggest(3, 3, 9, 2));
  return 0;
}
```

最大的是 9。

### 只取最后一个

个数是 3 时，前两个用一个临时变量接住再丢掉，最后一个留下。传入 5、6、8，留下 8。这样能看清 `va_arg` 每次只向前移动一个。

```c run expect="8" title="最后一个"
#include <stdio.h>
#include <stdarg.h>
int last(int n, ...) {
  va_list ap;
  int value = 0;
  int i;
  va_start(ap, n);
  for (i = 0; i < n; i++) value = va_arg(ap, int);
  va_end(ap);
  return value;
}
int main(void) {
  printf("%d\n", last(3, 5, 6, 8));
  return 0;
}
```

最后取出的是 8。

### 练习：连乘

`product` 从 1 开始乘。2、3、4 连乘是 24。若个数是 0，循环不进入，结果保持 1，这一题传入三个正数。

```c run expect="24" title="2*3*4"
#include <stdio.h>
#include <stdarg.h>
int product(int n, ...) {
  va_list ap;
  int total = 1;
  int i;
  va_start(ap, n);
  for (i = 0; i < n; i++) total *= va_arg(ap, int);
  va_end(ap);
  return total;
}
int main(void) {
  printf("%d\n", product(3, 2, 3, 4));
  return 0;
}
```

连乘结果是 24。
