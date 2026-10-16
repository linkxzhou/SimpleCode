---
language: go
chapter: 27
title: "Go File Handling"
level: advanced
minutes: 8
goals:
  - "Accept that this page has no host disk"
  - "Assemble text with strings.Builder"
  - "Split in-memory text into lines"
sources:
  - gobyexample
updated: "2026-10-16"
---

A workstation program can create files through `os`. Yaegi in this drawer has no disk to offer. Samples that actually run only reshape text already in memory.

### No host path to write

`os.WriteFile` cannot rely on a directory here. The fragment below is the workstation shape, and it is not executed.

```go norun title="This page does not write the disk"
os.WriteFile("note.txt", []byte("tea\n"), 0644)
```

### Build the text in memory

`strings.Builder` collects bytes you might later write out. `String` returns what was collected.

```go run expect="tea" title="Join two lines"
package main

import (
	"fmt"
	"strings"
)

func main() {
	var b strings.Builder
	b.WriteString("tea\n")
	b.WriteString("water\n")
	fmt.Println(strings.Split(b.String(), "\n")[0])
}
```

The first piece is `tea`.

### Split on newlines

File text that already lives in a string is divided by `Split` at each newline. A final newline leaves an empty last piece.

```go run expect="2" title="Two non-empty lines"
package main

import (
	"fmt"
	"strings"
)

func main() {
	text := "tea\nwater\n"
	n := 0
	for _, line := range strings.Split(text, "\n") {
		if line != "" {
			n++
		}
	}
	fmt.Println(n)
}
```

Two non-empty pieces give the count `2`.

### The read-back is still a string

Without a file handle, checking the contents means checking the string. `Contains` reports whether one particular line is present.

```go run expect="true" title="Find one line"
package main

import (
	"fmt"
	"strings"
)

func main() {
	text := "tea\nwater\n"
	fmt.Println(strings.Contains(text, "water\n"))
}
```

The water line is present, so the flag is `true`.
