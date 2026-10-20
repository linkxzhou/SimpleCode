---
language: c
chapter: 29
title: "C stacks and queues"
level: intermediate
minutes: 9
goals:
  - "Build last-in first-out on an array"
  - "Build first-in first-out with head and tail indexes"
  - "Wrap indexes inside a fixed capacity"
sources:
  - cppreference
updated: "2026-10-20"
---

Both a stack and a queue fit in a fixed array. A stack moves only the top index. A queue remembers a head and a tail, and the value that leaves is the one that arrived first. The capacity is a constant. An index that reaches the end wraps to zero. This chapter does not call `malloc`.

### Last in, first out

Push 3, then push 8. A pop decreases the top first and reads 8, the value stored later. Three remains in the array and is not read this time.

```c run expect="8" title="Pop the later value"
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

The popped value is 8.

### Do not read past an empty stack

After 8 is popped the top is back at the slot that holds 3. One more pop would read 3 and return the top to zero. An empty stack must not be decremented. The program prints whether the top is already zero.

```c run expect="1" title="After emptying"
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

The top is zero, so the line is 1.

### The earlier value leaves first

The queue keeps `head` and `tail`. Values 2 and 5 are written at the tail. A read at the head returns 2. The capacity is 8 and the indexes wrap with remainder, though this sample never reaches the end.

```c run expect="2" title="Head is 2"
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

The head reads 2.

### Exercise: how many remain

After writing 2 and 5 and removing one, one logical element remains. `count` follows each insert and removal, which avoids subtracting head from tail and forgetting the wrap.

```c run expect="1" title="One remains"
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

One element remains. `slot` and `head` are updated; the count is the result this exercise prints.
