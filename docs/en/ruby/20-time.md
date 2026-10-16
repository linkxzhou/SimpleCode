---
language: ruby
chapter: 20
title: "Ruby Date and Time"
level: beginner
minutes: 8
goals:
  - "Construct a date"
  - "Format it as year, month, and day"
  - "Compare which of two times comes first"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

`Time` represents one moment. These examples use a fixed calendar date. They do not read the clock or the time zone of the machine.

### Construct a time

`Time.new` builds a time from a year, a month, and a day. `year` reads the year back out. The month and the day are stored, but this block does not print them.

```ruby run expect="2026" title="Year"
t = Time.new(2026, 10, 15)
puts t.year
```

The printed line is `2026`.

### Format

`strftime` turns the time into text from a format string. `%Y`, `%m`, and `%d` stand for year, month, and day. Hyphens in the format are copied into the result.

```ruby run expect="2026-10-15" title="Date text"
t = Time.new(2026, 10, 15)
puts t.strftime("%Y-%m-%d")
```

The printed line is `2026-10-15`.

### Order

An earlier moment compares as less than a later one. In the same year, October 1 comes before October 15. The comparison prints `true`.

```ruby run expect="true" title="October 1 is earlier"
a = Time.new(2026, 10, 1)
b = Time.new(2026, 10, 15)
puts a < b
```

The printed line is `true`.
