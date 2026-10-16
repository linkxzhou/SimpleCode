---
language: python
chapter: 27
title: "Python Files"
level: beginner
minutes: 8
goals:
  - "Leave the host disk untouched on this page"
  - "Write text in memory with StringIO"
  - "Split text that already sits in a string into lines"
sources:
  - lxiy-python
updated: "2026-10-16"
---

On your own machine, `open` can write a file. This interpreter does not rely on your disk. Runnable samples here use only text held in memory.

### Leave open for reading

A real filesystem path is not guaranteed in this drawer. Do not create a file from a sample that runs.

```python norun title="Do not write the disk"
open("note.txt", "w").write("tea\n")
```

### A file kept in memory

`io.StringIO` offers `write` and `getvalue`. The shape is close to a file, yet no path is involved.

```python run expect="tea" title="Write into memory"
import io
buf = io.StringIO()
buf.write("tea\n")
print(buf.getvalue().strip())
```

The stored line is `tea`.

### Cut the text into lines

When the content is already a string, `splitlines` breaks it on newlines and discards those newline characters.

```python run expect="2" title="Two lines"
text = "tea\nwater\n"
print(len(text.splitlines()))
```

The number of lines is `2`.
