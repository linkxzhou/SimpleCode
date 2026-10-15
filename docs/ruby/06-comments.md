---
language: ruby
chapter: 6
title: "Ruby 注释"
level: beginner
minutes: 8
goals:
  - "用井号写行注释"
  - "知道注释里的代码不执行"
  - "用 =begin 写多行注释"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

注释不产生输出。

### 行注释

`#` 到行尾被跳过。

```ruby run expect="可见" title="留下"
puts "可见" # 隐藏
```

输出里能看到 `可见`。

### 整行

单独一行的注释可以记下暂时不跑的式子。

```ruby run expect="留下" title="整行跳过"
# puts "隐藏"
puts "留下"
```

输出里能看到 `留下`。

### 多行注释

`=begin` 必须顶格，到 `=end` 为止都不执行。

```ruby run expect="留下" title="成块跳过"
=begin
puts "隐藏"
=end
puts "留下"
```

输出里能看到 `留下`。
