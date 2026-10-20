---
language: ruby
chapter: 30
title: "Ruby 小菜单"
level: intermediate
minutes: 8
goals:
  - "在 instance_eval 里写下 item"
  - "读回刚才写下的名字"
  - "连续写两项时保留最后一项"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

一小段 DSL 用 instance_eval 执行块。块里的 item 是菜单实例的方法，它把名字记在 @name 上。

### 块里写下 mug

build 创建菜单并 instance_eval 给定的块。item "mug" 把名字记下，最后打印 mug。

```ruby run expect="mug" title="记下 mug"
class Menu
  def item(name)
    @name = name
  end
  def self.build(&block)
    menu = new
    menu.instance_eval(&block)
    menu
  end
  attr_reader :name
end
menu = Menu.build { item "mug" }
puts menu.name
```

### 后写的 cup 覆盖 tea

块里先写 tea 再写 cup。@name 被盖住，读出来的是 cup。

```ruby run expect="cup" title="留下 cup"
class Menu
  def item(name)
    @name = name
  end
  def self.build(&block)
    menu = new
    menu.instance_eval(&block)
    menu
  end
  attr_reader :name
end
menu = Menu.build do
  item "tea"
  item "cup"
end
puts menu.name
```

### 数量方法记下 4

attr_reader 会盖住同名的 qty 方法，所以写入用 set_qty。块里调用 set_qty 4，再读 qty，打印 4。

```ruby run expect="4" title="数量 4"
class Menu
  def item(name)
    @name = name
  end
  def set_qty(n)
    @qty = n
  end
  def self.build(&block)
    menu = new
    menu.instance_eval(&block)
    menu
  end
  attr_reader :name, :qty
end
menu = Menu.build { set_qty 4 }
puts menu.qty
```

### 没有调用 item 时名字是空的

空块不调用 item。@name 仍是 nil。用 || 在打印前换成 none，得到一行稳定的 none。

```ruby run expect="none" title="没有名字"
class Menu
  def item(name)
    @name = name
  end
  def self.build(&block)
    menu = new
    menu.instance_eval(&block)
    menu
  end
  attr_reader :name
end
menu = Menu.build { }
puts menu.name || "none"
```
