---
language: c
chapter: 28
title: "C linked lists"
level: intermediate
minutes: 10
goals:
  - "Allocate one node with malloc"
  - "Read the second value through next"
  - "Free every node after the walk"
sources:
  - cppreference
updated: "2026-10-20"
---

Each node of a linked list comes from `malloc` and is tied to the next with a pointer. The length does not have to be fixed in advance. After the walk, free along the same chain. Printing a number does not by itself return the heap block.

### A single node

`head` points at a fresh node. `value` is 4 and `next` is empty. The program prints, then frees, and does not use the pointer again.

```c run expect="4" title="One node"
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

The stored value is 4.

### The second node

Allocate the node that holds 9 first. Then allocate the head, store 2, and point its `next` at the earlier node. Following `head->next` reads 9. Both blocks are freed.

```c run expect="9" title="Follow next"
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

The second node holds 9.

### Add the whole chain

The three values are 1, 2, and 4. The loop starts at the head and stops when `next` is null, adding each value it passes. The sum is 7. The chain is then detached from the head and freed.

```c run expect="7" title="Sum along the chain"
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

One plus two plus four is 7.

### Exercise: count the nodes

Three nodes sit on the chain. The counter ignores the stored numbers and adds one for each non-null pointer. The count is 3. Freeing still starts at the head.

Computer Systems: A Programmer's Perspective spends a long chapter on the heap. Only the catalog link is here: https://book.douban.com/subject/1230413 .

```c run expect="3" title="Three nodes"
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

The node count is 3.
