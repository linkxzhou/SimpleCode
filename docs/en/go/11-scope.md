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

```go run expect="克" title="A package-level unit"
package main

import "fmt"

var unit = "克"

func main() {
	fmt.Println(unit)
}
```

The unit prints `克`.

### Locals inside a function

A `:=` name begins on its line and ends when the function ends. A parameter is a local name as well.

```go run expect="林" title="A parameter"
package main

import "fmt"

func greet(name string) {
	fmt.Println(name)
}

func main() {
	greet("林")
}
```

The argument prints `林`.

### Shadowing

An inner `:=` of the same name makes that block see the new variable. The outer variable keeps its value.

```go run expect="苏州" title="An inner name"
package main

import "fmt"

func main() {
	city := "杭州"
	{
		city := "苏州"
		fmt.Println(city)
	}
}
```

The inner city is `苏州`. After the braces, the outer `city` is still 杭州.

### A name declared in if

A variable declared before the semicolon of `if` exists only for that statement.

```go run expect="通过" title="A score inside the condition"
package main

import "fmt"

func main() {
	if score := 80; score >= 60 {
		fmt.Println("通过")
	}
}
```

The passing grade prints `通过`.
