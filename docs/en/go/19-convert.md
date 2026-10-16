---
language: go
chapter: 19
title: "Go Type Conversion"
level: intermediate
minutes: 8
goals:
  - "Convert between numeric types by naming the target"
  - "Separate a rune-to-string conversion from an integer-to-text conversion"
  - "Parse decimal text with strconv"
sources:
  - gobyexample
updated: "2026-10-16"
---

Numeric types stay as written until you convert them. Name the type you want around the value.

### Numeric conversion

Put the fractional value in a variable, then convert that variable to `int`. Digits after the decimal point are cut off. Rounding does not occur.

```go run expect="3" title="Drop the fraction"
package main

import "fmt"

func main() {
	f := 3.9
	fmt.Println(int(f))
}
```

Truncating 3.9 leaves `3`.

### A rune becomes a string

`string` applied to a `rune` is the character for that code point. It is not the decimal spelling of the number.

```go run expect="A" title="Code point 65"
package main

import "fmt"

func main() {
	fmt.Println(string(rune(65)))
}
```

Code point 65 prints `A`.

### Integers and decimal text

`strconv.Itoa` renders an integer as text. `Atoi` parses that text and also returns an `error`.

```go run expect="7 true" title="Itoa and Atoi"
package main

import (
	"fmt"
	"strconv"
)

func main() {
	text := strconv.Itoa(7)
	n, err := strconv.Atoi(text)
	fmt.Println(n, err == nil)
}
```

The round trip prints `7 true`.

### A parse that fails

If the text is not an integer, `Atoi` returns an error. Leave that numeric result out of later arithmetic.

```go run expect="true" title="Not a number"
package main

import (
	"fmt"
	"strconv"
)

func main() {
	_, err := strconv.Atoi("no")
	fmt.Println(err != nil)
}
```

The failure flag is `true`.
