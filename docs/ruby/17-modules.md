---
language: ruby
chapter: 17
title: "Ruby 模块"
level: beginner
minutes: 8
goals:
  - "用模块收纳方法"
  - "用 include 混入实例方法"
  - "知道这里不能再读另一个文件"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

模块和类相似，但不能 `new`。它用来放一组方法。

### 模块方法

`def self.` 定义挂在模块上的方法。

```ruby run expect="shop" title="模块方法"
module Shop
  def self.label
    "shop"
  end
end
puts Shop.label
```

输出里能看到 `shop`。

### 混入

`include` 把模块的实例方法放进类。

```ruby run expect="mug" title="混入"
module Label
  def label
    "mug"
  end
end
class Cup
  include Label
end
puts Cup.new.label
```

输出里能看到 `mug`。

### 另一个文件不在

`require_relative` 要去读邻居文件。这个抽屉只有当前这一份。

```ruby norun title="没有邻居文件"
require_relative "shop"
```
