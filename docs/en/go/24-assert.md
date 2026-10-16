---
language: go
chapter: 24
title: "Go Type Assertions"
level: advanced
minutes: 8
goals:
  - "Assert an interface value down to a concrete type"
  - "Use two results so a mismatch does not panic"
  - "Branch on the dynamic type with a type switch"
sources:
  - gobyexample
updated: "2026-10-16"
---

A type assertion recovers the concrete type of a value stored in `any`.

### A type assertion

`v.(string)` returns the string when that is what `v` holds. A different dynamic type panics.

```go run expect="tea" title="Assertion succeeds"
package main

import "fmt"

func main() {
	var v any = "tea"
	fmt.Println(v.(string))
}
```

The asserted text is `tea`.

### The comma-ok form

Two results report the value and whether the assertion worked. A mismatch yields the zero value and does not panic.

```go run expect="false" title="Assertion fails"
package main

import "fmt"

func main() {
	var v any = 3
	_, ok := v.(string)
	fmt.Println(ok)
}
```

An integer is not a string, so the flag is `false`.

### A type switch

`switch v.(type)` selects a case from the dynamic type. Each case names one type.

```go run expect="whole" title="Branch by type"
package main

import "fmt"

func main() {
	var v any = 3
	switch v.(type) {
	case string:
		fmt.Println("word")
	case int:
		fmt.Println("whole")
	default:
		fmt.Println("other")
	}
}
```

The integer case prints `whole`.

### Test the type before you use it

Use the single-result form only when the dynamic type is already known. Otherwise prefer comma-ok or a type switch.

```go run expect="not a string" title="The other branch on failure"
package main

import "fmt"

func main() {
	var v any = 3
	if _, ok := v.(string); ok {
		fmt.Println("word")
	} else {
		fmt.Println("not a string")
	}
}
```

The else branch prints `not a string`.
