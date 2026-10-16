---
language: ruby
chapter: 8
title: "Ruby Loops"
level: beginner
minutes: 8
goals:
  - "Repeat a fixed count with times"
  - "Count down to zero with while"
  - "Leave a loop with break"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

A Ruby loop is often a count or a block. `while` still repeats while a condition stays true. `break` leaves the nearest loop before that condition would stop it.

### times

`times` counts from zero and runs the block three times. Each pass adds one to `sum`. After those three passes the total is 3.

```ruby run expect="3" title="Three times"
sum = 0
3.times { |i| sum += 1 }
puts sum
```

The printed line is `3`.

### while

The body repeats while the condition stays true and stops once it is false. `left` begins at 2 and drops by one on each pass. The print happens after the loop, when the value is 0.

```ruby run expect="0" title="Down to zero"
left = 2
while left > 0
  left -= 1
end
puts left
```

The printed line is `0`.

### break

`break` leaves the nearest enclosing loop. `loop do` would continue without that exit. The loop stops when `n` reaches 3, and that value is printed.

```ruby run expect="3" title="Stop at 3"
n = 0
loop do
  n += 1
  break if n == 3
end
puts n
```

The printed line is `3`.
