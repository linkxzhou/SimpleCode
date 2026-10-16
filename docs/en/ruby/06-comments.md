---
language: ruby
chapter: 6
title: "Ruby Comments"
level: beginner
minutes: 8
goals:
  - "Write a line comment with a hash"
  - "Leave code in a comment unexecuted"
  - "Write a multiline comment with =begin"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

A comment produces no output. Ruby skips it before the statement runs. Use one to leave a note, or to hold a line you do not want to run yet.

### A line comment

`#` starts a comment that lasts to the end of the line. The `puts` call is still executed. The note after the hash is not.

```ruby run expect="可见" title="Keep this"
puts "可见" # 隐藏
```

The printed line is `可见`.

### A whole line

A comment on its own line can hold an expression you are postponing. The commented `puts` is skipped. The following line still prints.

```ruby run expect="留下" title="Skip the whole line"
# puts "隐藏"
puts "留下"
```

The printed line is `留下`.

### A multiline comment

`=begin` must sit at the first column. Nothing between it and `=end` runs. The `puts` inside that span is ignored, and the line after `=end` runs.

```ruby run expect="留下" title="Skip the block"
=begin
puts "隐藏"
=end
puts "留下"
```

The printed line is `留下`.
