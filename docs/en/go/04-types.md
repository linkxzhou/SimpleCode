---
language: go
chapter: 4
title: "Go Data Types"
level: beginner
minutes: 8
goals:
  - "Distinguish int, float64, bool, and string"
  - "Recall the zero value of each type"
  - "Treat len of a string as a byte count"
sources:
  - gobyexample
updated: "2026-10-16"
---

Each value belongs to a type. That type chooses the legal operations and the zero value used before any assignment.

### Common types

These four types cover the early chapters. The last column is what you get if you declare the name and store nothing.

| Type | Meaning | Zero value |
| --- | --- | --- |
| int | integer | 0 |
| float64 | fractional number | 0 |
| bool | true or false | false |
| string | text | "" |

### Integers and floating-point numbers

When both operands are integers, `/` keeps only the whole-number quotient. Use `float64` when the fraction should survive.

```go run expect="3" title="Integer division"
package main

import "fmt"

func main() {
	fmt.Println(20 / 6)
}
```

Twenty divided by six prints `3`.

```go run expect="3.5" title="Floating-point division"
package main

import "fmt"

func main() {
	fmt.Println(7.0 / 2.0)
}
```

Seven divided by two prints `3.5`.

### Boolean values

A `bool` holds `true` or `false` and nothing else. It is not an integer, so the condition `if 1` is illegal.

```go run expect="true" title="A boolean"
package main

import "fmt"

func main() {
	open := true
	fmt.Println(open)
}
```

The flag prints `true`.

### How long a string is

`len` counts bytes. One Chinese character is usually three UTF-8 bytes.

```go run expect="6" title="Byte count"
package main

import "fmt"

func main() {
	fmt.Println(len("你好"))
}
```

The two characters occupy `6` bytes.
