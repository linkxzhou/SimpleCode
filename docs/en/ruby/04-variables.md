---
language: ruby
chapter: 4
title: "Ruby Variables"
level: beginner
minutes: 8
goals:
  - "Store a local under a lowercase name"
  - "Expect an error from an undefined local"
  - "Tell a local from a constant"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

A local variable starts with a lowercase letter or an underscore. The first assignment declares it. Reading a name that was never assigned raises an error.

### Assignment

A name points at a value, and a later assignment can point it elsewhere. `item` starts as one string and then becomes another. `puts` prints the later binding.

```ruby run expect="water" title="Rebind"
item = "tea"
item = "water"
puts item
```

The printed line is `water`.

### Constants start with a capital

A constant begins with a capital letter. The usual rule is not to assign it again. This example only reads `Boiling`.

```ruby run expect="100" title="Boiling point"
Boiling = 100
puts Boiling
```

The printed line is `100`.

### Write nil on purpose

Assign `nil` when a name should mean "not set yet." `nil?` asks whether the current value is that empty object. The answer printed here is `true`.

```ruby run expect="true" title="Is empty"
item = nil
puts item.nil?
```

The printed line is `true`.
