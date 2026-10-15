---
language: ruby
chapter: 9
title: "Ruby 方法"
level: beginner
minutes: 8
goals:
  - "定义带参数的方法"
  - "返回多个值"
  - "给参数默认值"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

方法名用小写。括号在调用时常常可以省略，课程里仍写上，避免和参数粘在一起。

### 参数

按位置传入。

```ruby run expect="12" title="面积"
def area(w, h)
  w * h
end
puts area(3, 4)
```

输出里能看到 `12`。

### 多个返回值

返回数组时，调用处可以一次解开。

```ruby run expect="2 1" title="商和余数"
def pair
  [2, 1]
end
q, r = pair
puts "#{q} #{r}"
```

输出里能看到 `2 1`。

### 默认参数

省略时使用默认值。

```ruby run expect="你好，客人" title="省略名字"
def greet(name = "客人")
  "你好，" + name
end
puts greet
```

输出里能看到 `你好，客人`。
