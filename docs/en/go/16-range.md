---
language: go
chapter: 16
title: "Go Range"
level: intermediate
minutes: 8
goals:
  - "Walk a slice with range"
  - "Drop an index you do not need"
  - "Walk a string one rune at a time"
sources:
  - gobyexample
updated: "2026-10-16"
---

`range` yields an index and an element on each pass. Both loop variables are assigned again every time around.

### Ranging over a slice

The first variable is the index. The second is a copy of the element.

```go run expect="1:茶" title="Index and element"
package main

import "fmt"

func main() {
	items := []string{"水", "茶"}
	for i, name := range items {
		if i == 1 {
			fmt.Printf("%d:%s\n", i, name)
		}
	}
}
```

The selected pair prints `1:茶`.

### Keeping only the element

Put `_` in the index position. A name you never read cannot stay in the source, or compilation fails.

```go run expect="2" title="Element count"
package main

import "fmt"

func main() {
	n := 0
	for _, name := range []string{"茶", "水"} {
		if name != "" {
			n++
		}
	}
	fmt.Println(n)
}
```

Both names are non-empty, so the count is `2`.

### Ranging over a string

When `range` walks a string, the index is a byte offset and the value is a `rune`. The value is not a raw byte.

```go run expect="2" title="Two Han characters"
package main

import "fmt"

func main() {
	n := 0
	for range "你好" {
		n++
	}
	fmt.Println(n)
}
```

Two runes produce `2`. `len("你好")` is still 6.

### Map order is unspecified

Ranging a map may visit keys in a different order on another run. To check one key, read the map with that key. Print order is not a promise.

```go run expect="18" title="Read by key"
package main

import "fmt"

func main() {
	price := map[string]int{"茶": 18}
	for _, v := range price {
		fmt.Println(v)
	}
}
```

The stored price is `18`. A single key means order cannot change this line.
