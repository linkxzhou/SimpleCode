---
language: linux
chapter: 25
title: "Linux grep"
level: advanced
minutes: 7
goals:
  - "Print the lines that match"
  - "Prefix line numbers with -n"
  - "End on fixed text when nothing matches"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

grep writes matching lines to standard output. Use a pattern whose encoding you have already tried on this image. A miss exits with status 1.

### Print the lines that match

printf builds two lines, and grep keeps only the line containing 乙. A Chinese pattern is fine, because the serial port decodes UTF-8.

```linux run expect="乙" title="Keep the matching line"
printf '甲\n乙\n' | grep 乙
```

The kept line is `乙`.

### -n prints a line number

A colon separates the number from the text. A match on the second line starts with 2:.

```linux run expect="2:b" title="A numbered line"
printf 'a\nb\n' | grep -n b
```

The numbered line is `2:b`.

### No match exits with status 1

If the script itself ended at 1, the docs smoke check would call the chapter a failure. || prints none, the process still exits 0, and the expectation locks that word.

```linux run expect="none" title="Nothing matched"
grep nope /etc/hostname || echo none
```

The script prints `none`.
