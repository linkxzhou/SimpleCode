---
language: go
chapter: 3
title: "Go Basic Syntax"
level: beginner
minutes: 8
goals:
  - "Write a line comment"
  - "Form names under Go's identifier rules"
  - "Let a newline finish a simple statement"
sources:
  - gobyexample
updated: "2026-10-16"
---

Syntax decides how names, comments, and statements are split apart.

### Comments

`//` comments through the end of the line. `/* */` may cover several lines. Comments emit nothing.

```go run expect="shown" title="Comments are skipped"
package main

import "fmt"

func main() {
	// this line does not run
	fmt.Println("shown")
}
```

What remains visible is `shown`.

### Identifiers

Letters, digits, and underscores may appear in a name, and a digit cannot come first. Idiomatic Go uses camel case when a name has several words.

```go run expect="8" title="Camel-case name"
package main

import "fmt"

func main() {
	itemCount := 8
	fmt.Println(itemCount)
}
```

The camel-case variable prints `8`.

### Where a statement ends

The compiler inserts a semicolon when a line ends. Keep `{` on that same line. A `{` moved onto the next line by itself is a syntax error.

```go run expect="same line" title="Where the opening brace sits"
package main

import "fmt"

func main() {
	fmt.Println("same line")
}
```

The message is `same line`.

### Capital letters export a name

Code in another package can see a name only when the name starts with a capital letter. This tutorial is a single file, and library code still follows the rule.

```go run expect="inner" title="A lowercase name stays inside"
package main

import "fmt"

func hidden() string {
	return "inner"
}

func main() {
	fmt.Println(hidden())
}
```

The unexported helper returns `inner`.
