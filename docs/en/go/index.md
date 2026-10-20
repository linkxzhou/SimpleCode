---
language: go
chapter: 0
title: "Go Tutorial"
level: beginner
minutes: 8
goals:
  - "Run one file in the browser interpreter"
  - "Write a program that begins with package main"
  - "Print a result with fmt.Println"
sources:
  - gobyexample
updated: "2026-10-16"
---

Go is a statically typed compiled language. This drawer does not call `go build`. Yaegi interprets the single source file in the editor.

### Program entry is main

The file opens with `package main`. Only the function named `main` is the entry point.

```go run expect="Hi" title="First program"
package main

import "fmt"

func main() {
	fmt.Println("Hi")
}
```

`Println` appends a newline. The line on the terminal is `Hi`.

### Print every result

A bare expression never shows up in the terminal. Hand the number to `fmt`, or the page looks blank after Run.

```go run expect="42" title="Print a calculation"
package main

import "fmt"

func main() {
	fmt.Println(6 * 7)
}
```

The calculation prints `42`.

### One file holds the program

Importing another package of your own fails, because that source is not loaded. The standard library may be imported. Put helper functions in this same file.

```go run expect="3" title="Helper in the same file"
package main

import "fmt"

func add(a, b int) int {
	return a + b
}

func main() {
	fmt.Println(add(1, 2))
}
```

The helper returns `3`.
### After chapter 29

select, WaitGroup, cancelable context, a worker pool, handwritten checks, reflect, string sorting, and word counts follow the modules chapter. time.Sleep, time.After, and WithTimeout still cannot run, and go test does not start.
