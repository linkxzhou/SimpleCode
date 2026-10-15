---
language: ruby
chapter: 7
title: "Ruby 条件判断"
level: beginner
minutes: 8
goals:
  - "用 if 和 else 分支"
  - "用 elsif 接更多条件"
  - "用 unless 表示反条件"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

条件为真才进入 `if` 和 `end` 之间。

### if else

只走一个分支。

```ruby run expect="正数" title="正数分支"
n = 4
if n > 0
  puts "正数"
else
  puts "非正"
end
```

输出里能看到 `正数`。

### elsif

从上往下试。

```ruby run expect="中" title="分数档"
score = 70
if score >= 90
  puts "高"
elsif score >= 60
  puts "中"
else
  puts "低"
end
```

输出里能看到 `中`。

### unless

`unless` 在条件为假时执行。

```ruby run expect="关着" title="反条件"
open = false
unless open
  puts "关着"
end
```

输出里能看到 `关着`。
