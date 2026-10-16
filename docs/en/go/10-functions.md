---
language: go
chapter: 10
title: "Go Functions"
level: beginner
minutes: 8
goals:
  - "Declare parameters and a result type"
  - "Return more than one result"
  - "Schedule cleanup with defer"
sources:
  - gobyexample
updated: "2026-10-16"
---

Naming a calculation makes it a function. Write a type for every parameter and every result.

### Define and call

Parameters sit inside the parentheses. The result type follows those parentheses.

```go run expect="5" title="Add two numbers"
package main

import "fmt"

func add(a, b int) int {
	return a + b
}

func main() {
	fmt.Println(add(2, 3))
}
```

Two plus three is `5`.

### Multiple results

Each result type is listed in parentheses. One assignment at the call receives all of them.

```go run expect="2 1" title="Quotient and remainder"
package main

import "fmt"

func div(a, b int) (int, int) {
	return a / b, a % b
}

func main() {
	q, r := div(5, 2)
	fmt.Println(q, r)
}
```

Five divided by two prints `2 1`.

### Variadic parameters

`...` in front of the parameter type accepts zero or more values of that type. The function sees those values as a slice.

```go run expect="6" title="Sum the arguments"
package main

import "fmt"

func total(xs ...int) int {
	n := 0
	for _, x := range xs {
		n += x
	}
	return n
}

func main() {
	fmt.Println(total(1, 2, 3))
}
```

One, two, and three total `6`.

### defer

`defer` schedules the call for the moment just before the current function returns. The registration made last runs first.

```go run expect="021" title="Deferred order"
package main

import "fmt"

func main() {
	defer fmt.Print(1)
	defer fmt.Print(2)
	fmt.Print(0)
}
```

The digits are `021`. The `0` is printed at once, and on return the later `defer` runs before the earlier one.
