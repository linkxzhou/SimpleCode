---
language: ruby
chapter: 22
title: "Ruby File Input and Output"
level: beginner
minutes: 8
goals:
  - "Remember that this page does not write the host disk"
  - "Simulate a write with StringIO"
  - "Split text that already sits in a string into lines"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

On your own machine, `File` can write a path. This page does not depend on that disk. The samples keep the bytes in a string instead.

### Leave File for reading

A real path is not guaranteed here. `File.write` would try to create a file beside the program. The call is shown for reading and is not run.

```ruby norun title="Do not write the disk"
File.write("note.txt", "tea")
```

### An in-memory buffer

`StringIO` offers `write` and `string`. `write` stores characters in the buffer. `string` returns what was stored, and `puts` prints those characters.

```ruby run expect="tea" title="Write into memory"
require "stringio"
b = StringIO.new
b.write("tea")
puts b.string
```

The printed line is `tea`.

### Split into lines

When the text is already a string, `lines` splits it on newlines. `chomp` drops the newline from each piece. Two pieces remain, so the length is 2.

```ruby run expect="2" title="Two lines"
puts "tea\nwater\n".lines.map(&:chomp).length
```

The printed line is `2`.
