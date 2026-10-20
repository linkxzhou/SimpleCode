---
language: ruby
chapter: 27
title: "Ruby method_missing"
level: intermediate
minutes: 8
goals:
  - "Print an unknown method name"
  - "Join the method name and an argument"
  - "Admit the name with respond_to_missing"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

A call to an undefined method enters method_missing. These samples return the method name instead of raising NoMethodError.

### An unknown call returns sku

Bag does not define sku. method_missing turns the method name into a string and the line is sku.

```ruby run expect="sku" title="Name is sku"
class Bag
  def method_missing(name, *)
    name.to_s
  end
end
puts Bag.new.sku
```

### The name and the argument join as sku-4

The call sku(4) puts 4 in args. The method name and that argument join with a hyphen into sku-4.

```ruby run expect="sku-4" title="With 4"
class Bag
  def method_missing(name, *args)
    name.to_s + "-" + args.first.to_s
  end
end
puts Bag.new.sku(4)
```

### respond_to is true for sku

method_missing alone can leave respond_to?(:sku) false. After respond_to_missing? is defined, the line is true.

```ruby run expect="true" title="Admit sku"
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

### A plain object still fails

A fresh Object has no sku. Calling it raises NoMethodError. That failure stays in a block that is not run.

```ruby norun title="A plain object has no sku"
puts Object.new.sku
```
