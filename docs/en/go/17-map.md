---
language: go
chapter: 17
title: "Go Maps"
level: intermediate
minutes: 8
goals:
  - "Create a map with make"
  - "Detect a missing key with comma-ok"
  - "Leave a nil map unwritten"
sources:
  - gobyexample
updated: "2026-10-16"
---

A map stores a value under a key. Keys must be comparable with `==`. Both strings and integers qualify.

### Creating a map

`make` returns an empty map that accepts writes. A composite literal can insert several pairs immediately.

```go run expect="18" title="A literal"
package main

import "fmt"

func main() {
	price := map[string]int{"茶": 18}
	fmt.Println(price["茶"])
}
```

The price of 茶 is `18`.

### The comma-ok lookup

A read returns the value and whether the key was present. A missing key yields the zero value and `false`.

```go run expect="false" title="No such key"
package main

import "fmt"

func main() {
	price := map[string]int{}
	_, ok := price["水"]
	fmt.Println(ok)
}
```

The missing drink reports `false`.

### delete

`delete` removes one entry by key. Calling it for a key that is already absent is still safe.

```go run expect="false" title="After deletion"
package main

import "fmt"

func main() {
	price := map[string]int{"茶": 18}
	delete(price, "茶")
	_, ok := price["茶"]
	fmt.Println(ok)
}
```

After the removal the lookup is `false`.

### A nil map rejects writes

A map variable with no `make` and no literal is `nil`. Reading it returns the zero value. Writing it panics.

```go run expect="不能写" title="Create before you write"
package main

import "fmt"

func main() {
	defer func() {
		if recover() != nil {
			fmt.Println("不能写")
		}
	}()
	var price map[string]int
	price["茶"] = 18
}
```

The panic is reported as `不能写`.
