---
language: ruby
chapter: 0
title: "Ruby Tutorial"
minutes: 8
goals:
  - "Print one line with puts"
  - "Remember that gem install does not run here"
  - "Write a tiny program that includes a comment"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

This book runs the current file with Ruby 3.2. There is no page to fetch and no extra gem to load. Press Run on a block to see what that block prints.

### The first line

`puts` writes its argument and then adds a newline. The argument here is a quoted string. Those characters stay as written in the program.

```ruby run expect="你好" title="Say hello"
puts "你好"
```

The printed line is `你好`.

### gem install is unavailable

`gem install` needs a network connection and a directory on the machine. The Run button will not carry out that command. Read the line as a reminder of what this page skips.

```ruby norun title="Not source"
gem install rails
```

### A hash starts a comment

Text after `#` on the same line is skipped. It never shows up in the output. The `puts` before the hash still runs.

```ruby run expect="留下" title="Skip the comment"
puts "留下" # 隐藏
```

The printed line is `留下`.
