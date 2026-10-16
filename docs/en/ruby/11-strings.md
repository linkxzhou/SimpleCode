---
language: ruby
chapter: 11
title: "Ruby Strings"
level: beginner
minutes: 8
goals:
  - "Tell a character count from a byte count"
  - "Embed an expression with interpolation"
  - "Strip a trailing newline with chomp"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

The default encoding is UTF-8. `length` counts characters. `bytesize` counts bytes. Interpolation and `chomp` operate on that same string.

### Character count

Two Chinese characters have a `length` of 2. The count follows characters, not the bytes under them. `你好` is therefore two units long.

```ruby run expect="2" title="Two characters"
puts "你好".length
```

The printed line is `2`.

### Byte count

That same string has a `bytesize` of 6. Each character takes three UTF-8 bytes. `length` and `bytesize` answer different questions.

```ruby run expect="6" title="Six bytes"
puts "你好".bytesize
```

The printed line is `6`.

### Interpolation

An expression inside `#{}` is turned into text. `name` holds a short string, and the surrounding quotes build a greeting around it. The hash and braces themselves are not printed.

```ruby run expect="你好，林" title="Embed a name"
name = "林"
puts "你好，#{name}"
```

The printed line is `你好，林`.

### Read one line

`gets` reads a line and keeps the newline. `chomp` removes that trailing newline before you use the text. The sample input is a name followed by a line break.

```ruby run stdin="林\n" expect="你好，林" title="Read one line"
name = gets.chomp
puts "你好，#{name}"
```

The printed line is `你好，林`.
