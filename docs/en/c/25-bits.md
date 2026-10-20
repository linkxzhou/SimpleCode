---
language: c
chapter: 25
title: "C bitwise operations"
level: intermediate
minutes: 8
goals:
  - "Shift and mask a single bit"
  - "Flip selected bits with xor"
  - "Clear the low bit with a complement mask"
sources:
  - cppreference
updated: "2026-10-20"
---

An int is a row of bits. Shifts, and, or, and xor act on those bits and do not carry the way addition does. The numbers below stay small so the result can be checked by hand. The operator pages on cppreference were used only to match names. The programs were written for this playground.

### Shift, then mask

Five is 101 in binary. Shifting it left by one makes 1010, which is ten. A bitwise and with six (110) keeps only the bit that is set in both numbers, so the result is two.

```c run expect="2" title="Shift then and"
#include <stdio.h>
int main(void) {
  printf("%d\n", (5 << 1) & 6);
  return 0;
}
```

The line shows 2.

### Or turns a bit on

One has only the lowest bit set. Four sets bit 2, counting from zero. Or keeps every bit that is set in either value, which is five in decimal. A bit that is already on stays on.

```c run expect="5" title="Turn another bit on"
#include <stdio.h>
int main(void) {
  printf("%d\n", 1 | 4);
  return 0;
}
```

The result is 5.

### Xor flips bits

Six is 110 and three is 011. Xor yields one where the bits differ and zero where they match, so the pattern is 101, or five. Xor with the same mask again would restore the original; this section does it once.

```c run expect="5" title="Keep the differing bits"
#include <stdio.h>
int main(void) {
  printf("%d\n", 6 ^ 3);
  return 0;
}
```

The printed value is 5.

### Exercise: clear the low bit

Seven is 111. The complement of one has the low bit clear and the other bits set. And-ing the two clears only that low bit and leaves six. The C Programming Language places bitwise operators early. The catalog link is the only borrow: https://book.douban.com/subject/1139336 .

```c run expect="6" title="Low bit cleared"
#include <stdio.h>
int main(void) {
  printf("%d\n", 7 & ~1);
  return 0;
}
```

Seven becomes 6.
