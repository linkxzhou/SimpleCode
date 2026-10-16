---
language: ruby
chapter: 9
title: "Ruby Methods"
level: beginner
minutes: 8
goals:
  - "Define a method that takes parameters"
  - "Return more than one value"
  - "Give a parameter a default value"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

Method names are lowercase. Parentheses are often optional at the call. This book still writes them so the arguments stay easy to see.

### Parameters

Arguments are matched by position. `area` multiplies width by height. The call `area(3, 4)` binds `w` to 3 and `h` to 4.

```ruby run expect="12" title="Area"
def area(w, h)
  w * h
end
puts area(3, 4)
```

The printed line is `12`.

### Several return values

A method can return an array, and the caller can unpack it in one assignment. `pair` returns two numbers. `q` receives the first and `r` receives the second.

```ruby run expect="2 1" title="Quotient and remainder"
def pair
  [2, 1]
end
q, r = pair
puts "#{q} #{r}"
```

The printed line is `2 1`.

### Default parameters

A parameter may carry a default. That default is used when the caller omits the argument. Calling `greet` with no argument uses the string written in the definition.

```ruby run expect="你好，客人" title="Omit the name"
def greet(name = "客人")
  "你好，" + name
end
puts greet
```

The printed line is `你好，客人`.
