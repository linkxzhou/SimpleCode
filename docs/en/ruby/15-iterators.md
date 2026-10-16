---
language: ruby
chapter: 15
title: "Ruby Iterators"
level: beginner
minutes: 8
goals:
  - "Walk elements with each"
  - "Filter with select"
  - "Accumulate with reduce"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

An iterator is a method that takes a block. On arrays, the usual three are `each`, `select`, and `reduce`. Each one visits the elements and lets the block decide the next step.

### each

The block runs once for every element. This block ignores the element and only counts the visits. Three elements produce a count of 3.

```ruby run expect="3" title="Three items"
n = 0
[1, 2, 3].each { n += 1 }
puts n
```

The printed line is `3`.

### select

`select` keeps an element only when the block returns true. `even?` is true for 2 and for 4. `join` prints the numbers that remain.

```ruby run expect="2,4" title="Even numbers"
puts [1, 2, 3, 4].select { |n| n.even? }.join(",")
```

The printed line is `2,4`.

### reduce

`reduce` starts from an initial value and folds each element into it. The block receives the running total and the next number. From 0, the three numbers add up to 6.

```ruby run expect="6" title="Running total"
puts [1, 2, 3].reduce(0) { |sum, n| sum + n }
```

The printed line is `6`.
