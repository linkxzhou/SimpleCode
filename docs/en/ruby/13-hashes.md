---
language: ruby
chapter: 13
title: "Ruby Hashes"
level: beginner
minutes: 8
goals:
  - "Read a value by its key"
  - "Supply a default for a missing key"
  - "Walk keys and values"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

A hash finds a value from its key. The newer form writes `key: value` and stores a symbol. The older `=>` form can use a string as the key.

### Lookup

Write the key inside square brackets. Here the key is the string stored in the hash. The value attached to it is the integer 18.

```ruby run expect="18" title="Unit price"
price = { "tea" => 18 }
puts price["tea"]
```

The printed line is `18`.

### A default from fetch

If the key is absent, `fetch` can return a default you pass in. `"water"` is not a key in this hash. The second argument, `0`, is what comes back.

```ruby run expect="0" title="Missing key"
price = { "tea" => 18 }
puts price.fetch("water", 0)
```

The printed line is `0`.

### Symbol keys

A key written with a colon is a symbol, not a string. The lookup must use a symbol too. `item[:name]` matches the key written as `name:`.

```ruby run expect="tea" title="Symbol key"
item = { name: "tea" }
puts item[:name]
```

The printed line is `tea`.
