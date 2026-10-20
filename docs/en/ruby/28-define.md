---
language: ruby
chapter: 28
title: "Ruby define_method"
level: intermediate
minutes: 8
goals:
  - "Install sku with define_method"
  - "Install two methods from a list of names"
  - "Return a passed quantity from the new method"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

define_method creates a method by name inside the class body. The name can come from a variable. An instance calls the new method the same way it calls a method written with def.

### The dynamic sku method returns tea

define_method(:sku) in the class body returns tea. Calling sku on an instance prints tea.

```ruby run expect="tea" title="Dynamic tea"
class Menu
  define_method(:sku) { "tea" }
end
puts Menu.new.sku
```

### Two generated names join into teacup

The loop defines a method for tea and a method for cup. Each body returns its own name. Calling both and joining them prints teacup.

```ruby run expect="teacup" title="tea then cup"
class Menu
  ["tea", "cup"].each do |name|
    define_method(name) { name }
  end
end
menu = Menu.new
puts menu.tea + menu.cup
```

### The method returns the passed 4

The define_method block takes qty. Calling qty(4) returns 4 unchanged and prints it.

```ruby run expect="4" title="Return 4"
class Menu
  define_method(:qty) { |n| n }
end
puts Menu.new.qty(4)
```

### A singleton method returns mug

define_singleton_method attaches the method to Menu itself, not to instances. Menu.label prints mug.

```ruby run expect="mug" title="Class method mug"
class Menu
  define_singleton_method(:label) { "mug" }
end
puts Menu.label
```
