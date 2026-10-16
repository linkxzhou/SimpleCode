---
language: ruby
chapter: 19
title: "Ruby Regular Expressions"
level: beginner
minutes: 8
goals:
  - "Test a match with =~"
  - "Take one piece out with match"
  - "Replace text with gsub"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

A regular expression is written between slashes. `\d` means one digit. `=~`, `match`, and `gsub` are three ways to apply that pattern to a string.

### Whether it matches

`=~` returns an index when the pattern matches, and `nil` when it does not. An index counts as true, so the ternary takes the first branch. The pattern asks for one or more digits.

```ruby run expect="有" title="Has a digit"
puts "房号 18" =~ /\d+/ ? "有" : "无"
```

The printed line is `有`.

### Take a match out

`match` returns match data, and `[0]` is the entire match. The pattern stops at the first run of digits. That run is the characters `18`.

```ruby run expect="18" title="First match"
puts "房号 18".match(/\d+/)[0]
```

The printed line is `18`.

### Replace

`gsub` replaces every match, not only the first. `\s+` means one or more whitespace characters. Two spaces in the source become a single space.

```ruby run expect="a b" title="Collapse spaces"
puts "a  b".gsub(/\s+/, " ")
```

The printed line is `a b`.
