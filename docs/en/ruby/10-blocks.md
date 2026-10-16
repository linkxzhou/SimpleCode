---
language: ruby
chapter: 10
title: "Ruby Blocks"
level: beginner
minutes: 8
goals:
  - "Pass a block to a method"
  - "Call the block with yield"
  - "Choose between braces and do end"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

A block is code you hand to a method. Inside that method, `yield` runs the block. Braces fit a single line, and `do` with `end` fits several lines.

### Pass a block to each

Block parameters sit between vertical bars. `each` invokes the block once per element. `last` is replaced every time, so it finishes as the final name.

```ruby run expect="茶" title="Last item"
last = ""
["水", "茶"].each { |name| last = name }
puts last
```

The printed line is `茶`.

### Call yield yourself

One `yield` runs the attached block once. `once` does nothing except that call. The block prints at the moment `yield` reaches it.

```ruby run expect="进了" title="Call the block"
def once
  yield
end
once { puts "进了" }
```

The printed line is `进了`.

### do and end for several lines

A block that spans lines uses `do` and `end`. The result matches a brace block. This one adds every number into `sum`.

```ruby run expect="6" title="Sum the numbers"
sum = 0
[1, 2, 3].each do |n|
  sum += n
end
puts sum
```

The printed line is `6`.
