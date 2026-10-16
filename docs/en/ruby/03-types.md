---
language: ruby
chapter: 3
title: "Ruby Data Types"
level: beginner
minutes: 8
goals:
  - "Tell integers, decimals, strings, and booleans apart"
  - "Inspect a type with class"
  - "Treat nil as empty"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

The first values you meet are integers, decimals, strings, booleans, and `nil`. Every value belongs to a class. In a condition, only two of those values count as false.

### Integers and strings

Dividing two integers stays in integer arithmetic and drops the fraction. A string needs quotes around the text. Here `20 / 6` is `3`, not a decimal.

```ruby run expect="3" title="Integer division"
puts 20 / 6
```

The printed line is `3`.

### The type name

`.class` returns the class of the receiver. For `3`, that class is `Integer`. Printing the class shows the type without a manual conversion.

```ruby run expect="Integer" title="Integer class"
puts 3.class
```

The printed line is `Integer`.

### nil and false

Only `nil` and `false` count as false in a condition. The number `0` counts as true. The ternary therefore takes the first branch.

```ruby run expect="真" title="Zero is truthy"
puts 0 ? "真" : "假"
```

The printed line is `真`.
