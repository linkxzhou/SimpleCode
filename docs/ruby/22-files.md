---
language: ruby
chapter: 22
title: "Ruby 文件的输入与输出"
level: beginner
minutes: 8
goals:
  - "知道本页不写宿主机磁盘"
  - "用 StringIO 模拟写入"
  - "按行切开已经放在字符串里的内容"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

本机可以用 `File` 写路径。这个抽屉不依赖你的磁盘。

### File 留在阅读里

真实路径这里没有保证。

```ruby norun title="不写磁盘"
File.write("note.txt", "茶")
```

### 内存缓冲

`StringIO` 有 `write` 和 `string`。

```ruby run expect="茶" title="写入内存"
require "stringio"
b = StringIO.new
b.write("茶")
puts b.string
```

输出里能看到 `茶`。

### 按行切开

内容已经在字符串里时，`lines` 按换行切开。

```ruby run expect="2" title="两行"
puts "茶\n水\n".lines.map(&:chomp).length
```

输出里能看到 `2`。
