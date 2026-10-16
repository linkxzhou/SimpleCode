---
language: go
chapter: 2
title: "Go Program Structure"
level: beginner
minutes: 8
goals:
  - "Write the package clause, the imports, and main"
  - "Use every name you import"
  - "Keep helper functions in the same file"
sources:
  - gobyexample
updated: "2026-10-16"
---

A program you can run is a package clause, one or more imports, and `func main`.

### The package clause

`package` must be the first line that is not a comment. For a program, that name is `main`.

```go run expect="main bag" title="Package clause"
package main

import "fmt"

func main() {
	fmt.Println("main bag")
}
```

The printed words are `main bag`.

### Import lists

`import` brings in exported names from other packages. Parentheses list several packages, one on each line.

```go run expect="2" title="Import two packages"
package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println(len(strings.TrimSpace("  ab ")))
}
```

`TrimSpace` strips both ends, leaving `ab`. The length printed is `2`.

### The main function

`func main()` has no parameters and no result. Execution starts in that function.

```go run expect="enter" title="Entry point"
package main

import "fmt"

func main() {
	fmt.Println("enter")
}
```

The word printed is `enter`.

### Every import is used

A normal compiler rejects an import that nothing references. Each import in this course appears later in the file, so taking the text to `go build` does not fail for that reason.

```go norun title="Unused import"
package main

import "strings"

func main() {}
```

Remove a package you never call, or call it for real.
