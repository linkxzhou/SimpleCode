---
language: linux
chapter: 34
title: "Linux sort and counts"
level: intermediate
minutes: 8
goals:
  - "Order three words lexicographically"
  - "Drop duplicates with uniq"
  - "Count bytes with wc and add a prefix"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

sort reorders lines lexicographically. uniq removes adjacent duplicate lines, so sort comes first. The spaces in wc -c are not stable, so they are deleted before the prefix bytes- is added.

### Three words sort as cup, mug, tea

The input order is mug, tea, cup. After sort, cup is first, then mug, then tea.

```linux run expect="cup\nmug\ntea" title="Dictionary order"
printf 'mug\ntea\ncup\n' | sort
```

### Duplicate tea collapses to one line

tea is written twice and cup once. After sort | uniq, cup and tea each occupy one line.

```linux run expect="cup\ntea" title="Drop duplicates"
printf 'tea\ntea\ncup\n' | sort | uniq
```

### ab and a newline are 3 bytes

printf 'ab\n' is a, b, and a newline: 3 bytes. tr deletes any spaces wc may pad with, then the line is bytes-3.

```linux run expect="bytes-3" title="3 bytes"
n=$(printf 'ab\n' | wc -c | tr -cd '0-9')
echo "bytes-$n"
```

### Two text lines count as 2

wc -l counts newlines. The two lines tea and cup produce 2. Spaces are removed, then the line is lines-2.

```linux run expect="lines-2" title="2 lines"
n=$(printf 'tea\ncup\n' | wc -l | tr -cd '0-9')
echo "lines-$n"
```
