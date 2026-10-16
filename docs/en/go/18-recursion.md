---
language: go
chapter: 18
title: "Go Recursion"
level: intermediate
minutes: 8
goals:
  - "Write a function that calls itself"
  - "Include a base case that stops the calls"
  - "Check the result on a small argument"
sources:
  - gobyexample
updated: "2026-10-16"
---

A recursive function calls itself. One branch must return without another call, or the stack grows without a limit.

### Factorial

`fact(n)` multiplies `n` by `fact(n-1)`. `fact(1)` returns `1`.

```go run expect="24" title="Factorial of 4"
package main

import "fmt"

func fact(n int) int {
	if n <= 1 {
		return 1
	}
	return n * fact(n-1)
}

func main() {
	fmt.Println(fact(4))
}
```

Four factorial is `24`.

### The base case

Write the stopping case before the recursive call. Leave it out and the function never returns.

```go run expect="1" title="Stop at 1"
package main

import "fmt"

func fact(n int) int {
	if n <= 1 {
		return 1
	}
	return n * fact(n-1)
}

func main() {
	fmt.Println(fact(1))
}
```

The call on 1 returns `1`.

### Summing downward

Adding from `n` down to `1` stops for the same reason: the base case returns.

```go run expect="10" title="Add 1 through 4"
package main

import "fmt"

func sumTo(n int) int {
	if n <= 1 {
		return n
	}
	return n + sumTo(n-1)
}

func main() {
	fmt.Println(sumTo(4))
}
```

One through four total `10`.

### Keep the call stack shallow

Every nested call keeps a frame of its own. Arguments in this chapter stay in the single digits. A very deep chain runs out of stack, which these samples are not trying to show.

```go run expect="3" title="Three levels"
package main

import "fmt"

func down(n int) int {
	if n == 0 {
		return 0
	}
	return 1 + down(n-1)
}

func main() {
	fmt.Println(down(3))
}
```

Three steps down print `3`.
