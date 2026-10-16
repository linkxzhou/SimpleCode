---
language: ruby
chapter: 12
title: "Ruby Arrays"
level: beginner
minutes: 8
goals:
  - "Read an element by index"
  - "Add an element with push"
  - "Build a new array with map"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

Indexes start at 0. `push` changes the array you already have. `map` returns a fresh array and leaves the original untouched.

### Index

The second item sits at index 1. Square brackets select that slot. The item at index 0 is not the one printed.

```ruby run expect="茶" title="Second item"
puts ["水", "茶"][1]
```

The printed line is `茶`.

### push

`push` appends one element to the original array. `nums` starts with a single number. After the append, index 1 holds the new value.

```ruby run expect="2" title="Append"
nums = [1]
nums.push(2)
puts nums[1]
```

The printed line is `2`.

### map

`map` returns a new array. The block doubles each number. `join` turns that new array into one comma-separated line.

```ruby run expect="2,4,6" title="Double each"
puts [1, 2, 3].map { |n| n * 2 }.join(",")
```

The printed line is `2,4,6`.
