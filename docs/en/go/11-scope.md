---
language: go
chapter: 11
title: "Go Variable Scope"
level: beginner
minutes: 8
goals:
  - "Tell a package-level name from a function-local one"
  - "Spot an inner declaration hiding an outer name"
  - "Expect an if initializer to end with that statement"
sources:
  - gobyexample
updated: "2026-10-16"
---

A name can be read only inside the block that declared it. An inner block may declare a new variable with the same name.

### Package-level variables

A variable written outside every function is readable by the functions in this file. It does not have to be referenced on the line that declares it.

```go run expect="gram" title="A package-level unit"
package main

import "fmt"

var unit = "gram"

func main() {
	fmt.Println(unit)
}
```

The unit prints `gram`.

### Locals inside a function

A `:=` name begins on its line and ends when the function ends. A parameter is a local name as well.

```go run expect="lin" title="A parameter"
package main

import "fmt"

func greet(name string) {
	fmt.Println(name)
}

func main() {
	greet("lin")
}
```

The argument prints `lin`.

### Shadowing

An inner `:=` of the same name makes that block see the new variable. The outer variable keeps its value.

```go run expect="suzhou" title="An inner name"
package main

import "fmt"

func main() {
	city := "hangzhou"
	{
		city := "suzhou"
		fmt.Println(city)
	}
}
```

The inner city is `suzhou`. After the braces, the outer `city` is still hangzhou.

### A name declared in if

A variable declared before the semicolon of `if` exists only for that statement.

```go run expect="clear" title="A score inside the condition"
package main

import "fmt"

func main() {
	if score := 80; score >= 60 {
		fmt.Println("clear")
	}
}
```

The passing grade prints `clear`.
