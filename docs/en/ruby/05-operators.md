---
language: ruby
chapter: 5
title: "Ruby Operators"
level: beginner
minutes: 8
goals:
  - "Use integer division and remainder"
  - "Use comparison operators"
  - "Combine conditions with && and ||"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

For integers, `/` drops the remainder. A comparison yields `true` or `false`. `&&` and `||` combine those results.

### Quotient and remainder

`/` yields the quotient and `%` yields the remainder. Dividing `21` by `10` leaves a quotient of `2` and a remainder of `1`. Interpolation places both numbers on one line.

```ruby run expect="2 1" title="Twenty-one divided by ten"
puts "#{21 / 10} #{21 % 10}"
```

The printed line is `2 1`.

### Comparison

`==` asks whether two values are equal. `>` asks which one is larger. `3 > 1` is true, so `puts` prints that boolean.

```ruby run expect="true" title="Greater than"
puts 3 > 1
```

The printed line is `true`.

### Logic

`&&` is true only when both sides are true. `true && false` is therefore false. `||` would succeed if either side were true.

```ruby run expect="false" title="And"
puts true && false
```

The printed line is `false`.
