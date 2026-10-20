---
language: ruby
chapter: 30
title: "Ruby menu DSL"
level: intermediate
minutes: 8
goals:
  - "Write item inside instance_eval"
  - "Read back the name that was written"
  - "Keep the last name when two items are written"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

A small DSL runs a block with instance_eval. item inside the block is a method on the menu instance, and it stores the name in @name.

### The block records mug

build creates a menu and instance_eval runs the given block. item "mug" stores the name, and the line is mug.

```ruby run expect="mug" title="Record mug"
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

### A later cup replaces tea

The block writes tea and then cup. @name is overwritten, so the value read back is cup.

```ruby run expect="cup" title="Keep cup"
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

### The quantity method stores 4

attr_reader would replace a method also named qty, so the writer is set_qty. The block calls set_qty 4, then qty is read, and the line is 4.

```ruby run expect="4" title="Quantity 4"
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

### The name is empty when item is never called

An empty block never calls item, so @name stays nil. || replaces it with none before printing, which keeps the line stable.

```ruby run expect="none" title="No name"
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
