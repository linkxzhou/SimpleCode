---
language: ruby
chapter: 18
title: "Ruby Exceptions"
level: beginner
minutes: 8
goals:
  - "Catch a failure with begin and rescue"
  - "Branch on the exception class"
  - "Report a failure yourself with raise"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

A failure leaves the current path. `rescue` catches one class and can print a short line instead. `raise` creates that failure on purpose so the caller can handle it.

### Catch a conversion failure

`Integer` raises `ArgumentError` when the text is not numeric. The `puts` after the conversion never runs. The `rescue` clause prints in its place.

```ruby run expect="失败" title="Invalid text"
begin
  Integer("no")
  puts "过了"
rescue ArgumentError
  puts "失败"
end
```

The printed line is `失败`.

### Division by zero

An integer divided by zero raises `ZeroDivisionError`. Naming that class in `rescue` keeps the handler specific. The handler prints one fixed line.

```ruby run expect="除零" title="Catch it"
begin
  1 / 0
rescue ZeroDivisionError
  puts "除零"
end
```

The printed line is `除零`.

### Raise on purpose

`raise` hands the problem to the caller. `sell` raises when the count is below 1. The bare `rescue` prints the same message the `raise` carries.

```ruby run expect="数量不够" title="Raise it"
def sell(n)
  raise "数量不够" if n < 1
  n
end
begin
  sell(0)
rescue
  puts "数量不够"
end
```

The printed line is `数量不够`.
