---
language: linux
chapter: 32
title: "Linux sed"
level: intermediate
minutes: 8
goals:
  - "Replace tea with mug"
  - "Replace both teas on one line"
  - "Print only the second line"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

sed edits text line by line. s/old/new/ replaces the first match. A trailing g replaces every match on that line. -n with p prints only the selected line.

### tea becomes mug

There is a single tea. s/tea/mug/ replaces it with mug and prints the line.

```linux run expect="mug" title="Become mug"
printf 'tea\n' | sed 's/tea/mug/'
```

### Both matches on one line change

tea tea has a space in the middle. With g, both matches become mug, so the line is mug mug.

```linux run expect="mug mug" title="Replace both"
printf 'tea tea\n' | sed 's/tea/mug/g'
```

### Keep only the second line b

-n turns off automatic printing. 2p prints only the second line, b.

```linux run expect="b" title="Second line"
printf 'a\nb\n' | sed -n '2p'
```

### Drop the line that contains cup

/cup/d deletes the matching line. tea remains. cup does not appear.

```linux run expect="tea" title="Delete cup"
printf 'tea\ncup\n' | sed '/cup/d'
```
