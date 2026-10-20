---
language: linux
chapter: 33
title: "Linux awk"
level: intermediate
minutes: 8
goals:
  - "Print the second column"
  - "Add quantities from two lines"
  - "Read the sku length with length"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

awk splits each line on whitespace. $1 is the first column and $2 is the second. END prints a total after every line has been read.

### The second column is 4

On the line tea 4, the second column is 4. print $2 writes only that column.

```linux run expect="4" title="Second column"
printf 'tea 4\n' | awk '{print $2}'
```

### 4 plus 1 is 5

The second columns are 4 and 1. s adds that column on each line, and END prints 5.

```linux run expect="5" title="Total 5"
printf 'tea 4\ncup 1\n' | awk '{s+=$2} END {print s}'
```

### The length of tea is 3

length($1) counts characters in the first column. tea has 3 letters.

```linux run expect="3" title="Length 3"
printf 'tea\n' | awk '{print length($1)}'
```

### Add only rows whose sku is tea

The tea quantities are 4 and 2, and cup is 1. The test $1=="tea" keeps 6.

```linux run expect="6" title="Tea only"
printf 'tea 4\ncup 1\ntea 2\n' | awk '{ if ($1=="tea") s+=$2 } END { print s }'
```
