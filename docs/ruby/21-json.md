---
language: ruby
chapter: 21
title: "Ruby JSON"
level: beginner
minutes: 8
goals:
  - "把文本解析成哈希"
  - "把哈希写成文本"
  - "接住损坏的文本"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

`json` 是标准库。键在 JSON 里必须是双引号。

### 解析

`JSON.parse` 得到哈希，字符串键可以取出数字。

```ruby run expect="3" title="读出数字"
require "json"
puts JSON.parse("{\"n\":3}")["n"]
```

输出里能看到 `3`。

### 生成

`JSON.generate` 得到文本。再解析可以取回同一个数字。

```ruby run expect="3" title="写后再读"
require "json"
text = JSON.generate({ "n" => 3 })
puts JSON.parse(text)["n"]
```

输出里能看到 `3`。

### 损坏

少一个括号时解析失败。

```ruby run expect="坏了" title="解析失败"
require "json"
begin
  JSON.parse("{")
  puts "过了"
rescue JSON::ParserError
  puts "坏了"
end
```

输出里能看到 `坏了`。
