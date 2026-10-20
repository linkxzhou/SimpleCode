---
language: ruby
chapter: 26
title: "Ruby 混入"
level: intermediate
minutes: 8
goals:
  - "用 include 混入一个标签方法"
  - "用 Comparable 比较毫升数"
  - "按毫升数排序后取最小的"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

模块用 include 混进类。Comparable 只要求写出 <=>。排序时 Ruby 会反复调用这个方法。

### 混入之后 sku 是 tea

Label 定义 sku。Cup include 这个模块后，实例就能调用 sku，打印 tea。

```ruby run expect="tea" title="混入 tea"
module Label
  def sku
    "tea"
  end
end
class Cup
  include Label
end
puts Cup.new.sku
```

### 3 毫升小于 5 毫升

<=> 比较 ml。3 < 5 为真，puts 打印 true。比较运算符来自 Comparable。

```ruby run expect="true" title="3 小于 5"
class Cup
  include Comparable
  attr_reader :ml
  def initialize(ml)
    @ml = ml
  end
  def <=>(other)
    ml <=> other.ml
  end
end
puts Cup.new(3) < Cup.new(5)
```

### 排序后最小是 1

三只杯子的毫升数是 5、1、3。sort 按 <=> 升序，第一只的 ml 是 1。

```ruby run expect="1" title="最小是 1"
class Cup
  include Comparable
  attr_reader :ml
  def initialize(ml)
    @ml = ml
  end
  def <=>(other)
    ml <=> other.ml
  end
end
cups = [Cup.new(5), Cup.new(1), Cup.new(3)]
puts cups.sort.first.ml
```

### 相等时打印 true

两只都是 4 毫升。== 在 Comparable 里会看 <=> 是否为 0，所以打印 true。

```ruby run expect="true" title="毫升相同"
class Cup
  include Comparable
  attr_reader :ml
  def initialize(ml)
    @ml = ml
  end
  def <=>(other)
    ml <=> other.ml
  end
end
puts Cup.new(4) == Cup.new(4)
```
