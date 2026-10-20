---
language: ruby
chapter: 28
title: "Ruby define_method"
level: intermediate
minutes: 8
goals:
  - "用 define_method 装上 sku"
  - "按名字批量装两个方法"
  - "让新方法返回传入的数量"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

define_method 在类体里按名字创建方法。名字可以来自变量。创建出来的方法跟普通 def 一样由实例调用。

### 动态装上的 sku 返回 tea

类体里 define_method(:sku) 返回 tea。实例调用 sku 时打印 tea。

```ruby run expect="tea" title="动态 tea"
class Menu
  define_method(:sku) { "tea" }
end
puts Menu.new.sku
```

### 两个名字接成 teacup

循环为 tea 和 cup 各定义一个方法，方法体返回自己的名字。依次调用再拼接，得到 teacup。

```ruby run expect="teacup" title="tea 接 cup"
class Menu
  ["tea", "cup"].each do |name|
    define_method(name) { name }
  end
end
menu = Menu.new
puts menu.tea + menu.cup
```

### 方法返回传入的 4

define_method 的块接收 qty。调用 qty(4) 把 4 原样返回并打印。

```ruby run expect="4" title="返回 4"
class Menu
  define_method(:qty) { |n| n }
end
puts Menu.new.qty(4)
```

### 类方法 define_singleton_method 返回 mug

define_singleton_method 装在 Menu 自己身上，而不是实例上。Menu.label 打印 mug。

```ruby run expect="mug" title="类方法 mug"
class Menu
  define_singleton_method(:label) { "mug" }
end
puts Menu.label
```
