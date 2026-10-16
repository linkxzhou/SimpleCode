---
language: go
chapter: 21
title: "Go Generics"
level: advanced
minutes: 8
goals:
  - "Add a type parameter to a function"
  - "Restrict that parameter with a constraint"
  - "Let the call infer the type parameter"
sources:
  - gobyexample
updated: "2026-10-16"
---

A type parameter lets one function body work for several types. Yaegi runs the simple forms shown here.

### Type parameters

`T` inside square brackets is the type parameter. A constraint of `any` allows whatever type the caller passes.

```go run expect="水" title="Take the second"
package main

import "fmt"

func second[T any](a, b T) T {
	return b
}

func main() {
	fmt.Println(second("茶", "水"))
}
```

The second string is `水`.

### Constraints

`~int` admits types whose underlying type is `int`. Comparisons such as `<` are then legal in the function body.

```go run expect="2" title="The smaller integer"
package main

import "fmt"

func smaller[T ~int](a, b T) T {
	if a < b {
		return a
	}
	return b
}

func main() {
	fmt.Println(smaller(4, 2))
}
```

The smaller of 4 and 2 is `2`.

### Inference at the call

When the arguments already determine `T`, the call can omit `[int]`.

```go run expect="4" title="Inferred as int"
package main

import "fmt"

func second[T any](a, b T) T {
	return b
}

func main() {
	fmt.Println(second(3, 4))
}
```

Inference selects `4`.

### One type argument per call

A single call has one `T`. `second` cannot accept a string and an integer together.

```go norun title="Type parameter mismatch"
second("茶", 1)
```

Check richer constraints and type sets with `go build` on your machine. These samples stay inside what Yaegi executes.
