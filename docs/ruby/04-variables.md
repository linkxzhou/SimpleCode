---
language: ruby
chapter: 4
title: "Ruby 变量"
level: beginner
minutes: 8
goals:
  - "用小写名字保存局部变量"
  - "知道未定义的局部变量会报错"
  - "区分局部变量和常量"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

局部变量以小写或下划线开头。第一次赋值即声明。

### 赋值

名字指向一个值，之后可以再指到别的值。

```ruby run expect="water" title="改绑定"
item = "tea"
item = "water"
puts item
```

输出里能看到 `water`。

### 常量以大写开头

常量习惯上不再改。这里只读取。

```ruby run expect="100" title="沸点"
Boiling = 100
puts Boiling
```

输出里能看到 `100`。

### nil 可以显式写入

想表示还没有，就把名字设成 `nil`。

```ruby run expect="true" title="是空"
item = nil
puts item.nil?
```

输出里能看到 `true`。
