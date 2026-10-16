---
language: ruby
chapter: 19
title: "Ruby 正则表达式"
level: beginner
minutes: 8
goals:
  - "用 =~ 判断是否匹配"
  - "用 match 取出一段"
  - "用 gsub 替换"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

正则写在斜杠里。`\d` 表示数字。

### 是否匹配

`=~` 匹配时给出位置，不匹配时是 `nil`。

```ruby run expect="has" title="有数字"
puts "room 18" =~ /\d+/ ? "has" : "none"
```

输出里能看到 `has`。

### 取出

`match` 的 `[0]` 是整段匹配。

```ruby run expect="18" title="第一处"
puts "room 18".match(/\d+/)[0]
```

输出里能看到 `18`。

### 替换

`gsub` 换掉每一处。

```ruby run expect="a b" title="压缩空白"
puts "a  b".gsub(/\s+/, " ")
```

输出里能看到 `a b`。
