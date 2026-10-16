---
language: go
chapter: 6
title: "Go Constants"
level: beginner
minutes: 8
goals:
  - "Declare a fixed value with const"
  - "Group related constants in parentheses"
  - "Build an increasing series with iota"
sources:
  - gobyexample
updated: "2026-10-16"
---

A constant is fixed when the program is compiled. Later statements cannot assign to it.

### A single constant

`const` is written much like `var`, except an initializer is required and that initializer must be a constant expression.

```go run expect="100" title="Boiling point"
package main

import "fmt"

func main() {
	const boiling = 100
	fmt.Println(boiling)
}
```

The boiling point prints `100`.

### Grouped constants

Parentheses keep related constants together. A line that omits the type or the expression repeats the previous line.

```go run expect="60 60" title="Grouped constants"
package main

import "fmt"

const (
	minute = 60
	second = minute
)

func main() {
	fmt.Println(minute, second)
}
```

Both names print `60 60`.

### iota

Inside one `const` block, `iota` begins at 0 and grows by 1 on each following line. It replaces a hand-written series of 0, 1, and 2.

```go run expect="0 1 2" title="iota indexes"
package main

import "fmt"

const (
	red = iota
	green
	blue
)

func main() {
	fmt.Println(red, green, blue)
}
```

The three indexes print `0 1 2`.

A fresh `const (` sets `iota` back to 0.
