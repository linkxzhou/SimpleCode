---
language: ruby
chapter: 25
title: "Ruby Struct"
level: intermediate
minutes: 8
goals:
  - "Store sku and a quantity in a Struct"
  - "Set the quantity with a keyword"
  - "Read the field names from members"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

Struct.new builds a class with named fields. The names and their order are fixed when the class is created. These samples use only sku and qty.

### The quantity field is 4

Item has sku and qty. new receives tea and 4 by position. Printing qty shows 4.

```ruby run expect="4" title="Quantity 4"
Item = Struct.new(:sku, :qty)
row = Item.new("tea", 4)
puts row.qty
```

### A keyword sets the quantity to 6

The keyword qty: 6 does not depend on remembering field order. sku is cup at the same time. The printed quantity is 6.

```ruby run expect="6" title="Keyword 6"
Item = Struct.new(:sku, :qty)
row = Item.new(sku: "cup", qty: 6)
puts row.qty
```

### Field names join into skuqty

members returns an array of symbols. map turns each symbol into a string and join produces skuqty.

```ruby run expect="skuqty" title="Two field names"
Item = Struct.new(:sku, :qty)
puts Item.members.map(&:to_s).join
```

### Two rows of quantity add to 5

One row has qty 4 and the other has qty 1. Adding the two qty fields prints 5.

```ruby run expect="5" title="4 plus 1"
Item = Struct.new(:sku, :qty)
a = Item.new("tea", 4)
b = Item.new("cup", 1)
puts a.qty + b.qty
```
