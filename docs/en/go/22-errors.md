---
language: go
chapter: 22
title: "Go Error Handling"
level: advanced
minutes: 8
goals:
  - "Report a failure through a return value"
  - "Construct an error with errors.New"
  - "Match a wrapped sentinel with errors.Is"
sources:
  - gobyexample
updated: "2026-10-16"
---

Go signals failure with an `error` result. The caller tests that result against `nil`.

### Return an error

Success pairs the useful result with a `nil` error. Failure returns a non-nil error, and the other result should be ignored.

```go run expect="true" title="An illegal divisor"
package main

import (
	"errors"
	"fmt"
)

func div(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("divisor  0")
	}
	return a / b, nil
}

func main() {
	_, err := div(4, 0)
	fmt.Println(err != nil)
}
```

Dividing by zero reports a failure, so the flag is `true`.

### errors.New

`errors.New` builds an error from a piece of text. Printing the error shows that text.

```go run expect="soldout" title="Error text"
package main

import (
	"errors"
	"fmt"
)

func main() {
	err := errors.New("soldout")
	fmt.Println(err)
}
```

The error text is `soldout`.

### Wrapping and errors.Is

In `fmt.Errorf`, `%w` nests an existing error inside a new one. Two separate `errors.New` calls stay distinct even when their strings match. Compare with a variable declared ahead of time.

```go run expect="true" title="A sentinel error"
package main

import (
	"errors"
	"fmt"
)

var errSoldOut = errors.New("soldout")

func main() {
	err := fmt.Errorf("order: %w", errSoldOut)
	fmt.Println(errors.Is(err, errSoldOut))
}
```

The wrapped sentinel matches, so the line is `true`.

### Leave custom errors out of the interface

Yaegi panics if a custom error value is stored in an `error` variable and `Error` is then called. Samples that run stick to `errors.New`.

```go norun title="Yaegi panics"
type myErr struct{ msg string }

func (e myErr) Error() string { return e.msg }

var err error = myErr{msg: "broken"}
err.Error()
```
