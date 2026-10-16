---
language: ruby
chapter: 7
title: "Ruby Conditionals"
level: beginner
minutes: 8
goals:
  - "Branch with if and else"
  - "Chain more tests with elsif"
  - "State the opposite test with unless"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

The body between `if` and `end` runs only when the condition is true. `else` covers the remaining case. `unless` runs when its condition is false.

### if and else

Only one branch runs. `n` is greater than zero, so the first `puts` runs. The `else` branch is skipped.

```ruby run expect="plus" title="Positive branch"
n = 4
if n > 0
  puts "plus"
else
  puts "badnum"
end
```

The printed line is `plus`.

### elsif

The tests are tried from top to bottom. `score` is not at least 90, so the first branch fails. It is at least 60, so the `elsif` branch prints.

```ruby run expect="mid" title="Score band"
score = 70
if score >= 90
  puts "high"
elsif score >= 60
  puts "mid"
else
  puts "low"
end
```

The printed line is `mid`.

### unless

`unless` executes its body when the condition is false. `open` is `false`, so the message prints. An `if` with the negated test would do the same job.

```ruby run expect="shut" title="Opposite condition"
open = false
unless open
  puts "shut"
end
```

The printed line is `shut`.
