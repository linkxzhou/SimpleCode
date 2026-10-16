---
language: cpp
chapter: 24
title: "C++ Data Structures"
level: beginner
minutes: 8
goals:
  - "Store one integer in a node"
  - "Link two nodes with a pointer"
  - "Delete each node when you finish"
sources:
  - learncpp
updated: "2026-10-16"
---

This chapter walks a hand-written singly linked list. It does not call the standard-library `list`.

### One node

A node holds a value and a pointer to the next node. This node stores 2 and has no successor.

```cpp run expect="2" title="One node"
#include <iostream>
struct Node {
  int value;
  Node *next;
};
int main() {
  Node *head = new Node{2, nullptr};
  std::cout << head->value << "\n";
  delete head;
  return 0;
}
```

The node value is `2`.

### Link the next node

Create the later node first, then point the earlier node's `next` at it. The two values are 2 and 8.

```cpp run expect="2 8" title="Two nodes"
#include <iostream>
struct Node {
  int value;
  Node *next;
};
int main() {
  Node *tail = new Node{8, nullptr};
  Node *head = new Node{2, tail};
  std::cout << head->value << " " << head->next->value << "\n";
  delete head;
  delete tail;
  return 0;
}
```

The two node values are `2 8`.

### Walk the pointer

Start at the first node and follow `next` once. The cursor then refers to the node whose value is 5.

```cpp run expect="5" title="Walk to the next"
#include <iostream>
struct Node {
  int value;
  Node *next;
};
int main() {
  Node *tail = new Node{5, nullptr};
  Node *head = new Node{2, tail};
  Node *cursor = head;
  cursor = cursor->next;
  std::cout << cursor->value << "\n";
  delete head;
  delete tail;
  return 0;
}
```

The node value is `5`.
