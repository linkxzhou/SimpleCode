---
language: c
chapter: 17
title: "C typedef"
level: beginner
minutes: 8
goals:
  - "给类型起一个短名"
  - "给结构体起名"
  - "给函数指针起名"
sources:
  - learn-c
updated: "2026-10-15"
---

`typedef` 不创造新的运算，只给已有类型一个别名。

### 整数别名

别名和原来的类型可以互相赋值。

```c run expect="18" title="单价"
#include <stdio.h>
typedef int Price;
int main(void) {
  Price p = 18;
  printf("%d\n", p);
  return 0;
}
```

输出里能看到 `18`。

### 结构体别名

有了别名，声明变量时不必再写 `struct`。

```c run expect="6" title="短名"
#include <stdio.h>
typedef struct { int price; } Item;
int main(void) {
  Item it;
  it.price = 6;
  printf("%d\n", it.price);
  return 0;
}
```

输出里能看到 `6`。

### 函数指针

别名把函数指针的写法收短。调用时仍是普通调用。

```c run expect="5" title="通过别名调用"
#include <stdio.h>
typedef int (*Bin)(int, int);
int add(int a, int b) { return a + b; }
int main(void) {
  Bin f = add;
  printf("%d\n", f(2, 3));
  return 0;
}
```

输出里能看到 `5`。
