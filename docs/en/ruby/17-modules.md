---
language: ruby
chapter: 17
title: "Ruby Modules"
level: beginner
minutes: 8
goals:
  - "Group methods in a module"
  - "Mix instance methods in with include"
  - "Remember that another file cannot be loaded here"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

A module resembles a class, but you cannot call `new` on it. It holds a group of methods. Those methods can live on the module, or be mixed into a class.

### A module method

`def self.` defines a method that belongs to the module. Call it as `Shop.label`, not through an instance. The module is never constructed.

```ruby run expect="shop" title="Module method"
module Shop
  def self.label
    "shop"
  end
end
puts Shop.label
```

The printed line is `shop`.

### Mix in

`include` copies the module's instance methods into the class. `Cup` does not define `label` itself. After the mix-in, a new cup can call that method.

```ruby run expect="mug" title="Mix in"
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

The printed line is `mug`.

### Another file is not here

`require_relative` would read a neighboring file. This page contains only the current file. The call is shown for reading, and Run does not execute it.

```ruby norun title="No neighboring file"
require_relative "shop"
```
