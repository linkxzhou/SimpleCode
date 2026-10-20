---
language: c
chapter: 29
title: "C 栈与队列"
level: intermediate
minutes: 9
goals:
  - "用数组和下标实现后进先出"
  - "用头尾下标实现先进先出"
  - "在固定容量里绕回开头"
sources:
  - cppreference
updated: "2026-10-20"
---

栈和队列都可以放在定长数组上。栈只移动栈顶；队列同时记住队头和队尾，取出的是先放进去的那个。容量用常量写死，下标走到末尾就绕回 0。这一章不调用 `malloc`。

### 后进先出

先压入 3，再压入 8。弹出时先减栈顶，读到的是后放进去的 8。3 还留在数组里，这一次不读它。

```c run expect="8" title="弹出后放入的"
#include <stdio.h>
int main(void) {
  int slot[4];
  int top = 0;
  slot[top++] = 3;
  slot[top++] = 8;
  printf("%d\n", slot[--top]);
  return 0;
}
```

弹出的是 8。

### 栈空时不下读

弹出 8 之后栈顶回到 0，里面仍有 3。再弹出一次得到 3，栈顶回到 0。空栈不能再减，所以打印栈顶是否为 0。

```c run expect="1" title="弹空之后"
#include <stdio.h>
int main(void) {
  int slot[4];
  int top = 0;
  slot[top++] = 3;
  slot[top++] = 8;
  top--;
  top--;
  printf("%d\n", top == 0);
  return 0;
}
```

栈顶回到 0，所以打印 1。

### 先放进去的先出来

队列用 `head` 和 `tail`。2 和 5 依次从尾部写入，取出时从头部读，先得到 2。容量是 8，下标用取余绕回，这一题还走不到末尾。

```c run expect="2" title="队头是 2"
#include <stdio.h>
int main(void) {
  int slot[8];
  int head = 0;
  int tail = 0;
  slot[tail] = 2;
  tail = (tail + 1) % 8;
  slot[tail] = 5;
  tail = (tail + 1) % 8;
  printf("%d\n", slot[head]);
  head = (head + 1) % 8;
  return 0;
}
```

队头读到 2。

### 练习：队列里还剩几个

写入 2 和 5 之后取出一个，数组里逻辑上还剩 1 个元素。用 `count` 跟着进出增减，避免用头尾相减时忘掉绕回。

```c run expect="1" title="还剩一个"
#include <stdio.h>
int main(void) {
  int slot[8];
  int head = 0;
  int tail = 0;
  int count = 0;
  slot[tail] = 2;
  tail = (tail + 1) % 8;
  count++;
  slot[tail] = 5;
  tail = (tail + 1) % 8;
  count++;
  head = (head + 1) % 8;
  count--;
  printf("%d\n", count);
  return 0;
}
```

还剩 1 个。`slot` 和 `head` 被写过，计数才是这一题要看的结果。
