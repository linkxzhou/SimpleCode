---
language: go
chapter: 28
title: "Go Modules"
level: advanced
minutes: 8
goals:
  - "Record local dependencies in go.mod"
  - "Treat this page as one source file"
  - "Import only standard-library packages the interpreter provides"
sources:
  - gobyexample
updated: "2026-10-16"
---

Since Go 1.16, a directory is usually one module, and `go.mod` lists what it depends on. Run on this page does not read a module file.

### Modules on a workstation

`go mod init` writes `go.mod`. A third-party package is imported by module path, and `go mod tidy` records that requirement. Those lines are toolchain commands, not Go source.

```go norun title="Toolchain commands"
go mod init example.com/shop
go get rsc.io/quote
```

### Only the editor file exists

Yaegi executes the text in the editor. A second `.go` file is absent, and so is `go.mod`.

```go run expect="单文件" title="The current file"
package main

import "fmt"

func main() {
	fmt.Println("单文件")
}
```

The label printed is `单文件`.

### Standard-library import paths

Packages such as `fmt` come with the interpreter. They do not need a line in `go.mod`.

```go run expect="1" title="The standard library"
package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println(strings.Count("a", "a"))
}
```

The count of one letter is `1`.

### A private import path fails

`import "shop/order"` fails because that directory does not exist. Keep helper code beside `main`.

```go norun title="No such package"
package main

import "shop/order"

func main() {
	order.Print()
}
```
