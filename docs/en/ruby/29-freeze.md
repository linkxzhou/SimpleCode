---
language: ruby
chapter: 29
title: "Ruby freeze"
level: intermediate
minutes: 8
goals:
  - "frozen? is true after a string is frozen"
  - "Rescue a change to a frozen string"
  - "A frozen array refuses push"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

After freeze, an object refuses changes to its contents. frozen? reports that state. A refused change raises FrozenError, and the samples rescue it.

### A frozen tea reports true

After the string tea calls freeze, frozen? is true. puts prints true.

```ruby run expect="true" title="Already frozen"
item = "tea".freeze
puts item.frozen?
```

### Appending a character prints locked

<< on a frozen string raises FrozenError. rescue prints locked, and the original string is left unchanged.

```ruby run expect="locked" title="Cannot append"
item = "tea".freeze
begin
  item << "x"
  puts "open"
rescue FrozenError
  puts "locked"
end
```

### push on a frozen array also prints locked

The array starts with tea. After freeze, push of cup fails and rescue prints locked.

```ruby run expect="locked" title="Cannot push"
items = ["tea"].freeze
begin
  items.push("cup")
  puts "open"
rescue FrozenError
  puts "locked"
end
```

### An unfrozen string has frozen? false

The plain string cup never calls freeze. frozen? prints false, so the string can still change.

```ruby run expect="false" title="Not frozen yet"
puts "cup".frozen?
```
