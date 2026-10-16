---
language: go
chapter: 5
title: "Go Variables"
level: beginner
minutes: 8
goals:
  - "Declare a variable with var"
  - "Recognize a zero value"
  - "Use := inside a function"
sources:
  - gobyexample
updated: "2026-10-16"
---

A variable stores a value that later statements may replace. The function that declares it must also use it, or compilation fails.

### Declare with var

After `var` come the name and the type. The first value may be set on that line, or on a later assignment.

```go run expect="tea" title="A stated type"
package main

import "fmt"

func main() {
	var item string
	item = "tea"
	fmt.Println(item)
}
```

The item name is `tea`.

### Zero values

With no initializer, the variable receives the zero value of its type. That value is defined. It is not leftover memory.

```go run expect="0 false" title="Zero values"
package main

import "fmt"

func main() {
	var n int
	var ok bool
	fmt.Println(n, ok)
}
```

The integer and the flag print `0 false`.

### Short variable declarations

Inside a function, `:=` declares a name and assigns it. The right-hand side supplies the type. Package scope has no `:=`.

```go run expect="hangzhou" title="Short declaration"
package main

import "fmt"

func main() {
	city := "hangzhou"
	fmt.Println(city)
}
```

The city name is `hangzhou`.

Writing `:=` again for names that already exist in the same block, with no new name on the left, reports *no new variables*.

### Several names at once

Positions on the left match positions on the right. `_` throws away a value you will not use.

```go run expect="7" title="Blank identifier"
package main

import "fmt"

func main() {
	_, b := 5, 7
	fmt.Println(b)
}
```

The kept number is `7`. The `5` is discarded.
