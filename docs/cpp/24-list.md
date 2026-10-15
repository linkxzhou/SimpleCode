---
language: cpp
chapter: 24
title: "C++ 数据结构"
level: beginner
minutes: 8
goals:
  - "用结点保存一个整数"
  - "用指针把两个结点连起来"
  - "用完后 delete"
sources:
  - learncpp
updated: "2026-10-15"
---

这里用手写的单向链表看结构，不调用标准库的 `list`。

### 一个结点

结点里只有值和后继。

```cpp run expect="2" title="一个结点"
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

输出里能看到 `2`。

### 连上下一个

先创建后面的结点，再让前面的 `next` 指向它。

```cpp run expect="2 8" title="两个结点"
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

输出里能看到 `2 8`。

### 沿指针走

从第一个结点走到第二个，打印后者的值。

```cpp run expect="5" title="走到下一个"
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

输出里能看到 `5`。
