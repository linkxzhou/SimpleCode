---
language: go
chapter: 26
title: "Go Regular Expressions"
level: advanced
minutes: 8
goals:
  - "Test a match with regexp"
  - "Extract the first match"
  - "Replace the matched text"
sources:
  - gobyexample
updated: "2026-10-16"
---

Package `regexp` implements RE2. Patterns belong in raw strings, where one backslash is enough.

### MatchString

`MatchString` reports whether the text matched and returns any error from compiling or matching.

```go run expect="true" title="Contains a digit"
package main

import (
	"fmt"
	"regexp"
)

func main() {
	ok, err := regexp.MatchString(`\d+`, "room 18")
	fmt.Println(ok && err == nil)
}
```

A digit is present and compilation succeeded, so the line is `true`.

### FindString

`MustCompile` panics on an illegal pattern. With a valid pattern, `FindString` returns the first match.

```go run expect="18" title="The first number"
package main

import (
	"fmt"
	"regexp"
)

func main() {
	re := regexp.MustCompile(`\d+`)
	fmt.Println(re.FindString("room 18 slot"))
}
```

The first run of digits is `18`.

### ReplaceAllString

`ReplaceAllString` substitutes the given text for every match.

```go run expect="a b" title="Collapse whitespace"
package main

import (
	"fmt"
	"regexp"
)

func main() {
	re := regexp.MustCompile(`\s+`)
	fmt.Println(re.ReplaceAllString("a  b", " "))
}
```

The collapsed line is `a b`.

### Compile reports a bad pattern

`Compile` returns the error and leaves the rest of the program running. An unfinished pattern produces a non-nil error.

```go run expect="true" title="Compile fails"
package main

import (
	"fmt"
	"regexp"
)

func main() {
	_, err := regexp.Compile("[")
	fmt.Println(err != nil)
}
```

The broken pattern sets the flag to `true`.
