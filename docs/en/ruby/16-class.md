---
language: ruby
chapter: 16
title: "Ruby Classes and Objects"
level: beginner
minutes: 8
goals:
  - "Define a type with class"
  - "Store fields inside initialize"
  - "Reuse a method through inheritance"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

Open a class with `class`. Instance fields use `@`. Methods are public unless you change that. `new` builds an object and runs `initialize`.

### Fields

`initialize` runs when `new` is called. The argument is stored in `@ml`. `sip` reads that field and returns one less than its value.

```ruby run expect="7" title="Take a sip"
class Cup
  def initialize(ml)
    @ml = ml
  end
  def sip
    @ml - 1
  end
end
puts Cup.new(8).sip
```

The printed line is `7`.

### Inheritance

A subclass uses the parent method when it does not define its own. `Mug` is a `Cup` and adds no methods. `label` therefore comes from `Cup`.

```ruby run expect="杯子" title="Reuse the parent"
class Cup
  def label
    "杯子"
  end
end
class Mug < Cup
end
puts Mug.new.label
```

The printed line is `杯子`.

### Override

A subclass method with the same name hides the parent method. `Mug` defines its own `label`. Calling it on a `Mug` prints the subclass text.

```ruby run expect="马克杯" title="Override"
class Cup
  def label
    "杯子"
  end
end
class Mug < Cup
  def label
    "马克杯"
  end
end
puts Mug.new.label
```

The printed line is `马克杯`.
