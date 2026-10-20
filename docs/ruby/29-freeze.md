---
language: ruby
chapter: 29
title: "Ruby 冻结"
level: intermediate
minutes: 8
goals:
  - "冻结字符串后 frozen? 为真"
  - "修改冻结字符串会失败并被接住"
  - "冻结数组后不能再 push"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

freeze 之后对象不能再改内容。frozen? 用来查看这个状态。修改失败会抛 FrozenError，例子把它接住。

### 冻结的 tea 报告 true

字符串 tea 调用 freeze 之后，frozen? 为真。puts 打印 true。

```ruby run expect="true" title="已经冻结"
item = "tea".freeze
puts item.frozen?
```

### 追加字符时打印 locked

对冻结字符串使用 << 会抛 FrozenError。rescue 打印 locked，原字符串没有被改掉。

```ruby run expect="locked" title="不能追加"
item = "tea".freeze
begin
  item << "x"
  puts "open"
rescue FrozenError
  puts "locked"
end
```

### 冻结数组 push 也打印 locked

数组里原来有 tea。freeze 之后 push cup 失败，rescue 打印 locked。

```ruby run expect="locked" title="不能 push"
items = ["tea"].freeze
begin
  items.push("cup")
  puts "open"
rescue FrozenError
  puts "locked"
end
```

### 未冻结的字符串 frozen? 是 false

普通字符串 cup 没有调用 freeze。frozen? 打印 false，说明还能改。

```ruby run expect="false" title="尚未冻结"
puts "cup".frozen?
```
