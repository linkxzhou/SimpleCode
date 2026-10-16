---
language: go
chapter: 7
title: "Go Operators"
level: beginner
minutes: 10
goals:
  - "Apply arithmetic, relational, and logical operators"
  - "Run bitwise operations on integers"
  - "Make ++ a statement of its own"
sources:
  - gobyexample
updated: "2026-10-16"
---

An operator builds a result from its operands, or it compares two values.

### Arithmetic operators

For integers, `/` divides and drops the fraction, and `%` yields the remainder.

| Operator | Meaning | 21 and 10 |
| --- | --- | --- |
| + | addition | 31 |
| - | subtraction | 11 |
| * | multiplication | 210 |
| / | integer division | 2 |
| % | remainder | 1 |

```go run expect="2 1" title="Quotient and remainder"
package main

import "fmt"

func main() {
	a, b := 21, 10
	fmt.Println(a/b, a%b)
}
```

The pair of results is `2 1`.

### Relational and logical operators

A comparison produces a `bool`. Both sides of `&&` must hold. `||` holds when either side does. `!` inverts its operand.

```go run expect="true false" title="Comparisons"
package main

import "fmt"

func main() {
	a, b := 21, 10
	fmt.Println(a > b, a == b)
}
```

The two comparisons print `true false`.

### Bitwise operators

`&` is bitwise AND, `|` is bitwise OR, `^` is bitwise XOR, and `<<` together with `>>` shift bits. The sample numbers are 60 and 13.

```go run expect="12 61" title="AND and OR"
package main

import "fmt"

func main() {
	a, b := 60, 13
	fmt.Println(a&b, a|b)
}
```

The bitwise results are `12 61`.

### Increment is a statement

`++` and `--` stand only as a statement. The form `a = a++` is rejected.

```go run expect="22" title="An increment statement"
package main

import "fmt"

func main() {
	a := 21
	a++
	fmt.Println(a)
}
```

After the increment the value is `22`.

```go norun title="Not an expression"
a = a++
```
