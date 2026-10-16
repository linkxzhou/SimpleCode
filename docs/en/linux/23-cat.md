---
language: linux
chapter: 23
title: "Linux cat"
level: advanced
minutes: 7
goals:
  - "Send a file to standard output"
  - "Concatenate files in order"
  - "Read standard input when cat has no argument"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

cat copies bytes to standard output. For a docs Run, standard input comes from a file on 9p. It is not taken from the serial port, so it does not fight the wrapper for the terminal.

### Send the file bytes to standard output

A redirect stores one line under /tmp, and cat reads that line back. The expectation is the line itself.

```linux run expect="plain" title="A single file"
echo plain > /tmp/plain && cat /tmp/plain
```

The output is `plain`.

### Several files are concatenated from left to right

Arguments are read in the order written. When the second chunk appears, both files have been consumed.

```linux run expect="two" title="Joined in order"
echo one > /tmp/p && echo two > /tmp/q && cat /tmp/p /tmp/q
```

The second line is `two`.

### With no arguments, cat reads standard input until EOF

The fence stdin value is stored as /mnt/stdin.txt and then fed to cat. Chinese text is decoded from the serial bytes as UTF-8.

```linux run stdin="linxia\n" expect="linxia" title="The name that was read"
cat
```

The output is `linxia`.
