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

```ruby run expect="正数" title="Positive branch"
n = 4
if n > 0
  puts "正数"
else
  puts "非正"
end
```

The printed line is `正数`.

### elsif

The tests are tried from top to bottom. `score` is not at least 90, so the first branch fails. It is at least 60, so the `elsif` branch prints.

```ruby run expect="中" title="Score band"
score = 70
if score >= 90
  puts "高"
elsif score >= 60
  puts "中"
else
  puts "低"
end
```

The printed line is `中`.

### unless

`unless` executes its body when the condition is false. `open` is `false`, so the message prints. An `if` with the negated test would do the same job.

```ruby run expect="关着" title="Opposite condition"
open = false
unless open
  puts "关着"
end
```

The printed line is `关着`.
