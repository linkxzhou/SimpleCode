---
language: ruby
chapter: 14
title: "Ruby Ranges"
level: beginner
minutes: 8
goals:
  - "Write a range that includes the end"
  - "Write a range that excludes the end"
  - "Ask a range whether it covers a value"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

Two dots include the right end. Three dots leave that end out. Either form is a span you can sum, convert to an array, or test.

### Inclusive end

`1..3` holds three integers, and their sum is 6. The right end, 3, belongs to the range. `sum` adds every integer in that span.

```ruby run expect="6" title="One through three"
puts (1..3).sum
```

The printed line is `6`.

### Exclusive end

`1...3` holds only 1 and 2. The right end is omitted. `to_a` makes an array, and `join` prints it with commas.

```ruby run expect="1,2" title="Exclude 3"
puts (1...3).to_a.join(",")
```

The printed line is `1,2`.

### Coverage

`cover?` asks whether a value lies inside the range. `2` sits between the ends, so the answer is true. The range itself is not printed.

```ruby run expect="true" title="Cover 2"
puts (1..3).cover?(2)
```

The printed line is `true`.
