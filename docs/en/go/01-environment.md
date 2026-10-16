---
language: go
chapter: 1
title: "Go Environment Setup"
level: beginner
minutes: 8
goals:
  - "Separate this page from a local toolchain"
  - "Keep go env off the Run button"
  - "Import the standard library without a download"
sources:
  - gobyexample
updated: "2026-10-16"
---

Learning Go on a workstation means installing a toolchain and placing it on `PATH`. This page skips that install.

### Yaegi is already loaded

Run passes the editor text to Yaegi 0.16. Nothing here calls `go install`, and there is no `GOROOT` to edit.

```go run expect="已就绪" title="Runs with no install step"
package main

import "fmt"

func main() {
	fmt.Println("已就绪")
}
```

The status line is `已就绪`.

### Toolchain commands are not source

`go version` and `go env` are toolchain subcommands. They are not Go statements. A `.go` file that contains them does not become those commands.

```go norun title="Not source you can execute"
go version
go env GOPATH
```

Install the official toolchain when you want to compile on your own computer. The course button only interprets `package main`.

### The standard library is included

`fmt`, `strings`, and `errors` can be imported at once. No module fetch is required for them.

```go run expect="2" title="Call the standard library"
package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println(strings.Count("aa", "a"))
}
```

`Count` reports `2`.
