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

```go run expect="正数" title="if else"
package main

import "fmt"

func main() {
	n := 4
	if n > 0 {
		fmt.Println("正数")
	} else {
		fmt.Println("非正")
	}
}
```

The chosen word is `正数`.

### An initializer on if

A short declaration before the semicolon creates a name that exists only inside that `if`.

```go run expect="偏高" title="An initialization statement"
package main

import "fmt"

func main() {
	if temp := 36; temp > 35 {
		fmt.Println("偏高")
	}
}
```

The label is `偏高`. After this `if`, `temp` cannot be used.

### switch

Cases are tested from the top downward. A match does not continue into the next case, so you do not write `break`.

```go run expect="三" title="Branch on a value"
package main

import "fmt"

func main() {
	day := 3
	switch day {
	case 1:
		fmt.Println("一")
	case 3:
		fmt.Println("三")
	default:
		fmt.Println("其他")
	}
}
```

Day 3 prints `三`.

### switch with no value

Omit the value after `switch` and each case supplies its own condition. The shape is a chain of `if` and `else if`.

```go run expect="中等" title="A conditional switch"
package main

import "fmt"

func main() {
	score := 70
	switch {
	case score >= 90:
		fmt.Println("高")
	case score >= 60:
		fmt.Println("中等")
	default:
		fmt.Println("低")
	}
}
```

A score of 70 prints `中等`.
