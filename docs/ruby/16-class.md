---
language: ruby
chapter: 16
title: "Ruby 类和对象"
level: beginner
minutes: 8
goals:
  - "用 class 定义类型"
  - "在 initialize 里保存字段"
  - "用继承复用方法"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

类用 `class`，字段用 `@`。方法默认是公开的。

### 字段

`initialize` 在 `new` 时运行。

```ruby run expect="7" title="喝一口"
class Cup
  def initialize(ml)
    @ml = ml
  end
  def sip
    @ml - 1
  end
end
puts Cup.new(8).sip
```

输出里能看到 `7`。

### 继承

子类不重写时用父类的方法。

```ruby run expect="杯子" title="沿用"
class Cup
  def label
    "杯子"
  end
end
class Mug < Cup
end
puts Mug.new.label
```

输出里能看到 `杯子`。

### 重写

子类同名方法会盖住父类。

```ruby run expect="马克杯" title="覆盖"
class Cup
  def label
    "杯子"
  end
end
class Mug < Cup
  def label
    "马克杯"
  end
end
puts Mug.new.label
```

输出里能看到 `马克杯`。
