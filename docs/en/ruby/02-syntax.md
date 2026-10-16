---
language: ruby
chapter: 2
title: "Ruby Syntax"
level: beginner
minutes: 8
goals:
  - "Close a block with end"
  - "Treat a newline as the usual end of a statement"
  - "Define a method with def"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

Ruby closes a method, a condition, or a loop with `end`. Braces are not required to show nesting. A newline is usually enough to finish one statement.

### A method

`def` opens the method and `end` closes it. The body sits between those two words. `add` returns the sum, and `puts` prints that sum.

```ruby run expect="5" title="Add"
def add(a, b)
  a + b
end
puts add(2, 3)
```

The printed line is `5`.

### The last expression

The last expression in a method is its return value. You do not need to write `return`. `twice` multiplies by two, and the call prints that result.

```ruby run expect="8" title="Implicit return"
def twice(n)
  n * 2
end
puts twice(4)
```

The printed line is `8`.

### A semicolon is optional

One statement per line is easier to read. A semicolon can join two statements, but these calls each occupy a line. Both run, and the checked text is `first`.

```ruby run expect="first" title="First line"
puts "first"
puts "second"
```

The printed line is `first`.
