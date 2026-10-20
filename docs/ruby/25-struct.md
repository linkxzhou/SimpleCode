---
language: ruby
chapter: 25
title: "Ruby Struct"
level: intermediate
minutes: 8
goals:
  - "用 Struct 保存 sku 和数量"
  - "按关键字写出数量"
  - "用 members 看字段名"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

Struct.new 生成一个带字段的类。字段名和顺序在创建时定下来。下面的例子只放 sku 和 qty 两个字段。

### 数量字段是 4

Item 有 sku 和 qty。new 按位置传入 tea 和 4。打印 qty 得到 4。

```ruby run expect="4" title="数量 4"
Item = Struct.new(:sku, :qty)
row = Item.new("tea", 4)
puts row.qty
```

### 关键字把数量改成 6

关键字参数 qty: 6 不必再记住字段顺序。sku 同时写成 cup。打印的数量是 6。

```ruby run expect="6" title="关键字 6"
Item = Struct.new(:sku, :qty)
row = Item.new(sku: "cup", qty: 6)
puts row.qty
```

### 字段名连成 skuqty

members 返回符号数组。map 把每个符号转成字符串再接起来，得到 skuqty。

```ruby run expect="skuqty" title="两个字段名"
Item = Struct.new(:sku, :qty)
puts Item.members.map(&:to_s).join
```

### 两行数量相加是 5

一行 qty 是 4，另一行是 1。把两行的 qty 相加，打印 5。

```ruby run expect="5" title="4 加 1"
Item = Struct.new(:sku, :qty)
a = Item.new("tea", 4)
b = Item.new("cup", 1)
puts a.qty + b.qty
```
