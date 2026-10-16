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

`Hi` has a `length` of 2. The count follows characters.

```ruby run expect="2" title="Two characters"
puts "Hi".length
```

The printed line is `2`.

### Byte count

`Hello!` has a `bytesize` of 6. `length` and `bytesize` answer different questions, and each of these ASCII characters is one byte.

```ruby run expect="6" title="Six bytes"
puts "Hello!".bytesize
```

The printed line is `6`.

### Interpolation

An expression inside `#{}` is turned into text. `name` holds a short string, and the surrounding quotes build a greeting around it. The hash and braces themselves are not printed.

```ruby run expect="Hello, lin" title="Embed a name"
name = "lin"
puts "Hello, #{name}"
```

The printed line is `Hello, lin`.

### Read one line

`gets` reads a line and keeps the newline. `chomp` removes that trailing newline before you use the text. The sample input is a name followed by a line break.

```ruby run stdin="lin\n" expect="Hello, lin" title="Read one line"
name = gets.chomp
puts "Hello, #{name}"
```

The printed line is `Hello, lin`.
