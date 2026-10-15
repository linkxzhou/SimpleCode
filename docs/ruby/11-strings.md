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

两个汉字的 `length` 是 2。

```ruby run expect="2" title="两个字"
puts "你好".length
```

输出里能看到 `2`。

### 字节数

同一个字符串的 `bytesize` 是 6。

```ruby run expect="6" title="六个字节"
puts "你好".bytesize
```

输出里能看到 `6`。

### 插值

`#{}` 里的表达式会变成文本。

```ruby run expect="你好，林" title="嵌入"
name = "林"
puts "你好，#{name}"
```

输出里能看到 `你好，林`。

### 读入一行

`gets` 会连换行一起读入。`chomp` 去掉末尾换行。

```ruby run stdin="林\n" expect="你好，林" title="读一行"
name = gets.chomp
puts "你好，#{name}"
```

输出里能看到 `你好，林`。
