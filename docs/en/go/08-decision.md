---
language: go
chapter: 8
title: "Go Conditionals"
level: beginner
minutes: 8
goals:
  - "Choose a branch with if"
  - "Declare a name in an if initializer"
  - "Match discrete values with switch"
sources:
  - gobyexample
updated: "2026-10-16"
---

Which block runs depends on a `bool`. Leave the extra parentheses off the condition.

### if

The following block runs when the condition is true. Write `else` on the same line as the closing brace.

```go run expect="plus" title="if else"
package main

import "fmt"

func main() {
	n := 4
	if n > 0 {
		fmt.Println("plus")
	} else {
		fmt.Println("badnum")
	}
}
```

The chosen word is `plus`.

### An initializer on if

A short declaration before the semicolon creates a name that exists only inside that `if`.

```go run expect="toohigh" title="An initialization statement"
package main

import "fmt"

func main() {
	if temp := 36; temp > 35 {
		fmt.Println("toohigh")
	}
}
```

The label is `toohigh`. After this `if`, `temp` cannot be used.

### switch

Cases are tested from the top downward. A match does not continue into the next case, so you do not write `break`.

```go run expect="three" title="Branch on a value"
package main

import "fmt"

func main() {
	day := 3
	switch day {
	case 1:
		fmt.Println("one")
	case 3:
		fmt.Println("three")
	default:
		fmt.Println("other")
	}
}
```

Day 3 prints `three`.

### switch with no value

Omit the value after `switch` and each case supplies its own condition. The shape is a chain of `if` and `else if`.

```go run expect="medium" title="A conditional switch"
package main

import "fmt"

func main() {
	score := 70
	switch {
	case score >= 90:
		fmt.Println("high")
	case score >= 60:
		fmt.Println("medium")
	default:
		fmt.Println("low")
	}
}
```

A score of 70 prints `medium`.
