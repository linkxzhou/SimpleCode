---
language: ruby
chapter: 11
title: "Ruby 字符串"
level: beginner
minutes: 8
goals:
  - "区分字符数和字节数"
  - "用插值嵌入表达式"
  - "用 chomp 去掉换行"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

默认编码是 UTF-8。`length` 数字符，`bytesize` 数字节。

### 字符数

`Hi` 的 `length` 是 2。

```ruby run expect="2" title="两个字"
puts "Hi".length
```

输出里能看到 `2`。

### 字节数

`Hello!` 的 `bytesize` 是 6。

```ruby run expect="6" title="六个字节"
puts "Hello!".bytesize
```

输出里能看到 `6`。

### 插值

`#{}` 里的表达式会变成文本。

```ruby run expect="Hello, lin" title="嵌入"
name = "lin"
puts "Hello, #{name}"
```

输出里能看到 `Hello, lin`。

### 读入一行

`gets` 会连换行一起读入。`chomp` 去掉末尾换行。

```ruby run stdin="lin\n" expect="Hello, lin" title="读一行"
name = gets.chomp
puts "Hello, #{name}"
```

输出里能看到 `Hello, lin`。
