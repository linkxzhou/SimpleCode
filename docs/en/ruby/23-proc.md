---
language: ruby
chapter: 23
title: "Ruby Proc and lambda"
level: intermediate
minutes: 8
goals:
  - "Add two numbers with a proc"
  - "Check arity with a lambda"
  - "Let a proc remember an outer base"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

Proc and lambda are both callable objects. A lambda is strict about arity and raises ArgumentError when an argument is missing. This chapter rescues that error and prints arity.

### A proc adds 2 and 5 into 7

The proc takes two parameters and adds them. call(2, 5) prints 7. A proc does not reject a short argument list the way a lambda does.

```ruby run expect="7" title="Sum 7"
add = proc { |a, b| a + b }
puts add.call(2, 5)
```

### A short lambda call prints arity

The lambda requires two parameters. Passing only 2 raises ArgumentError. rescue prints arity, and the program still finishes successfully.

```ruby run expect="arity" title="Wrong arity"
add = lambda { |a, b| a + b }
begin
  add.call(2)
  puts "open"
rescue ArgumentError
  puts "arity"
end
```

### An outer base of 3 plus 4

The proc reads the outer base. When base is 3, call(4) prints 7. This proc does not declare a default parameter of its own.

```ruby run expect="7" title="3 plus 4"
base = 3
add = proc { |n| base + n }
puts add.call(4)
```

### Two proc results add to 9

one returns 4 and two returns 5. The outer expression adds those results and prints 9.

```ruby run expect="9" title="4 plus 5"
one = proc { 4 }
two = proc { 5 }
puts one.call + two.call
```
