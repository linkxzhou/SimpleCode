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

```ruby run expect="failed" title="Invalid text"
begin
  Integer("no")
  puts "passed"
rescue ArgumentError
  puts "failed"
end
```

The printed line is `failed`.

### Division by zero

An integer divided by zero raises `ZeroDivisionError`. Naming that class in `rescue` keeps the handler specific. The handler prints one fixed line.

```ruby run expect="divzero" title="Catch it"
begin
  1 / 0
rescue ZeroDivisionError
  puts "divzero"
end
```

The printed line is `divzero`.

### Raise on purpose

`raise` hands the problem to the caller. `sell` raises when the count is below 1. The bare `rescue` prints the same message the `raise` carries.

```ruby run expect="not enough" title="Raise it"
def sell(n)
  raise "not enough" if n < 1
  n
end
begin
  sell(0)
rescue
  puts "not enough"
end
```

The printed line is `not enough`.
