---
language: go
chapter: 9
title: "Go Loops"
level: beginner
minutes: 8
goals:
  - "Repeat a fixed count with a three-part for"
  - "Write a condition-only for where other languages use while"
  - "Redirect one iteration with break and continue"
sources:
  - gobyexample
updated: "2026-10-16"
---

`for` is the only loop keyword. A counter, a condition, and an open-ended loop are three spellings of it.

### The three-part for

Semicolons separate the initializer, the condition, and the post statement. The loop adds the numbers, then prints once.

```go run expect="6" title="Add from 1 through 3"
package main

import "fmt"

func main() {
	sum := 0
	for i := 1; i <= 3; i++ {
		sum += i
	}

	fmt.Println(sum)
}
```

The sum of 1, 2, and 3 is `6`.

### A condition by itself

Drop the initializer and the post statement, and `for` plays the role `while` has elsewhere.

```go run expect="0" title="Down to zero"
package main

import "fmt"

func main() {
	left := 2
	for left > 0 {
		left--
	}
	fmt.Println(left)
}
```

The countdown finishes at `0`.

### break and continue

`break` exits the whole loop. `continue` skips whatever is left of the current pass.

```go run expect="4" title="Skip even numbers"
package main

import "fmt"

func main() {
	sum := 0
	for i := 1; i <= 4; i++ {
		if i%2 == 0 {
			continue
		}
		sum += i
	}
	fmt.Println(sum)
}
```

Odds 1 and 3 add up to `4`.

### break ends an open for

`for { }` tests nothing. The body has to `break`, otherwise the function never returns.

```go run expect="3" title="Stop when the count hits 3"
package main

import "fmt"

func main() {
	n := 0
	for {
		n++
		if n == 3 {
			break
		}
	}
	fmt.Println(n)
}
```

The loop stops once `n` is `3`.
