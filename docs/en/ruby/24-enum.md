---
language: ruby
chapter: 24
title: "Ruby Enumerable"
level: intermediate
minutes: 8
goals:
  - "Keep numbers greater than 2 with select"
  - "Double each item with map and then sum"
  - "Count tea with tally"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

Array mixes in Enumerable. select, map, sum, and tally are all used below. The samples stick to integers and short strings so the expected line does not depend on an unstable walk.

### Numbers above 2 sum to 13

select keeps 4 and 9. The values 1 and 2 are dropped. The remaining two numbers sum to 13.

```ruby run expect="13" title="Filter then sum"
puts [1, 4, 2, 9].select { |n| n > 2 }.sum
```

### Doubling each item sums to 12

map turns 1, 2, and 3 into 2, 4, and 6. sum is 12. The block parameter n lives only for that map.

```ruby run expect="12" title="Double then sum"
puts [1, 2, 3].map { |n| n * 2 }.sum
```

### tea appears 2 times

tally counts each string. tea occurs twice and cup once. This sample prints only the tea count.

```ruby run expect="2" title="tea twice"
counts = ["tea", "tea", "cup"].tally
puts counts["tea"]
```

### reject drops 1 and leaves 6

reject removes items equal to 1. The leftover values are 2 and 4, and their sum is 6.

```ruby run expect="6" title="Drop 1"
puts [1, 2, 4].reject { |n| n == 1 }.sum
```
