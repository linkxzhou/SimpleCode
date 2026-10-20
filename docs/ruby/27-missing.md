---
language: ruby
chapter: 27
title: "Ruby method_missing"
level: intermediate
minutes: 8
goals:
  - "把未知方法名打出来"
  - "把方法名和参数接在一起"
  - "用 respond_to_missing 承认这个名字"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

调用一个没定义的方法时会进入 method_missing。下面让它返回方法名，而不是抛出 NoMethodError。

### 未知调用返回 sku

Bag 没有 sku 方法。method_missing 把方法名转成字符串，打印 sku。

```ruby run expect="sku" title="名字是 sku"
class Bag
  def method_missing(name, *)
    name.to_s
  end
end
puts Bag.new.sku
```

### 方法名和参数接成 sku-4

调用 sku(4) 时，args 里有 4。方法名和这个参数用连字符接成 sku-4。

```ruby run expect="sku-4" title="带上 4"
class Bag
  def method_missing(name, *args)
    name.to_s + "-" + args.first.to_s
  end
end
puts Bag.new.sku(4)
```

### respond_to 对 sku 为真

只写 method_missing 时，respond_to?(:sku) 仍可能是 false。补上 respond_to_missing? 之后打印 true。

```ruby run expect="true" title="承认 sku"
class Bag
  def method_missing(name, *)
    name.to_s
  end
  def respond_to_missing?(name, include_private = false)
    true
  end
end
puts Bag.new.respond_to?(:sku)
```

### 真正没有的普通对象会失败

Object 的新实例没有 sku。直接调用会抛 NoMethodError。这个失败留在不运行的块里。

```ruby norun title="普通对象没有 sku"
puts Object.new.sku
```
