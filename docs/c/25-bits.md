---
language: c
chapter: 25
title: "C 位运算"
level: intermediate
minutes: 8
goals:
  - "用移位和掩码取出一位"
  - "用异或翻转指定的位"
  - "用补码清掉最低位"
sources:
  - cppreference
updated: "2026-10-20"
---

整数在内存里是一串位。移位、与、或、异或都按位进行，不经过加减法的进位。下面的数都很小，结果可以直接心算核对。cppreference 的运算符页只用来对照名称，程序是按这个练习场另写的。

### 左移后再与

5 的二进制是 101。左移一位变成 1010，也就是 10。再和 6（二进制 110）做按位与，只剩下两者都为 1 的那一位，得到 2。

```c run expect="2" title="移位后与 6"
#include <stdio.h>
int main(void) {
  printf("%d\n", (5 << 1) & 6);
  return 0;
}
```

终端上是 2。

### 或把位打开

1 的最低位是 1，4 是把第 2 位（从 0 数）打开。两者做或，两个位置都保留，十进制是 5。已经是 1 的位不会被或运算关掉。

```c run expect="5" title="打开另一位"
#include <stdio.h>
int main(void) {
  printf("%d\n", 1 | 4);
  return 0;
}
```

结果是 5。

### 异或翻转

6 是 110，3 是 011。异或在两边不同时得到 1，相同时得到 0，所以是 101，也就是 5。同一掩码再异或一次会回到原数，这一节只做一次。

```c run expect="5" title="不同的位留下"
#include <stdio.h>
int main(void) {
  printf("%d\n", 6 ^ 3);
  return 0;
}
```

打印出来是 5。

### 练习：清掉最低位

7 是 111。`~1` 把最低位变成 0、其余位变成 1。两者相与之后，最低位被清掉，剩下 6。这是偶数判断以外的一种改位方法。《C程序设计语言》把位运算放在很前面，这里只留书目，不搬句子：https://book.douban.com/subject/1139336 。

```c run expect="6" title="最低位清零"
#include <stdio.h>
int main(void) {
  printf("%d\n", 7 & ~1);
  return 0;
}
```

7 变成 6。
