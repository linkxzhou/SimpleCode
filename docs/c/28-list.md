---
language: c
chapter: 28
title: "C 链表"
level: intermediate
minutes: 10
goals:
  - "用 malloc 串起一个结点"
  - "沿着 next 读出第二个值"
  - "走完链表后逐个 free"
sources:
  - cppreference
updated: "2026-10-20"
---

链表的结点各自来自 `malloc`，用 `next` 串起来。长度不必事先写死。用完必须沿同一条链 `free`，否则这一次运行虽然打出了数字，堆上的块仍算泄漏。

### 只有一个结点

`head` 指向刚分配的结点，`value` 写成 4，`next` 先空着。打印之后立刻释放，不留下悬空使用。

```c run expect="4" title="单结点"
#include <stdio.h>
#include <stdlib.h>
struct Node {
  int value;
  struct Node *next;
};
int main(void) {
  struct Node *head = malloc(sizeof *head);
  if (!head) return 1;
  head->value = 4;
  head->next = NULL;
  printf("%d\n", head->value);
  free(head);
  return 0;
}
```

结点里的值是 4。

### 第二个结点

先分配值为 9 的结点，再分配值为 2 的头结点并让它的 `next` 指向前者。顺着 `head->next` 读到 9。两个结点都要释放。

```c run expect="9" title="顺着 next"
#include <stdio.h>
#include <stdlib.h>
struct Node {
  int value;
  struct Node *next;
};
int main(void) {
  struct Node *tail = malloc(sizeof *tail);
  struct Node *head = malloc(sizeof *head);
  if (!head || !tail) return 1;
  tail->value = 9;
  tail->next = NULL;
  head->value = 2;
  head->next = tail;
  printf("%d\n", head->next->value);
  free(head);
  free(tail);
  return 0;
}
```

第二个结点是 9。

### 把整条链加起来

三个结点的值是 1、2、4。`walk` 从头部出发，直到 `next` 为空，把经过的值累加。累加结果是 7，然后从头部拆链释放。

```c run expect="7" title="链上求和"
#include <stdio.h>
#include <stdlib.h>
struct Node {
  int value;
  struct Node *next;
};
int main(void) {
  struct Node *c = malloc(sizeof *c);
  struct Node *b = malloc(sizeof *b);
  struct Node *a = malloc(sizeof *a);
  struct Node *p;
  struct Node *next;
  int sum = 0;
  if (!a || !b || !c) return 1;
  c->value = 4;
  c->next = NULL;
  b->value = 2;
  b->next = c;
  a->value = 1;
  a->next = b;
  for (p = a; p; p = p->next) sum += p->value;
  printf("%d\n", sum);
  p = a;
  while (p) {
    next = p->next;
    free(p);
    p = next;
  }
  return 0;
}
```

1、2、4 之和是 7。

### 练习：数结点

链上有三个结点。计数时不要把值加进去，只在每次走到非空指针时加一。数完是 3，释放顺序仍然从头开始。

《深入理解计算机系统》用更长的内存章节讲堆，这里只留链接，不搬它的例子：https://book.douban.com/subject/1230413 。

```c run expect="3" title="三个结点"
#include <stdio.h>
#include <stdlib.h>
struct Node {
  int value;
  struct Node *next;
};
int main(void) {
  struct Node *c = malloc(sizeof *c);
  struct Node *b = malloc(sizeof *b);
  struct Node *a = malloc(sizeof *a);
  struct Node *p;
  struct Node *next;
  int count = 0;
  if (!a || !b || !c) return 1;
  c->value = 8;
  c->next = NULL;
  b->value = 5;
  b->next = c;
  a->value = 1;
  a->next = b;
  for (p = a; p; p = p->next) count++;
  printf("%d\n", count);
  p = a;
  while (p) {
    next = p->next;
    free(p);
    p = next;
  }
  return 0;
}
```

结点个数是 3。
