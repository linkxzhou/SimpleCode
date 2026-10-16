---
language: go
chapter: 15
title: "Go Slices"
level: intermediate
minutes: 8
goals:
  - "Tell a slice from a fixed-length array"
  - "Read length and capacity with len and cap"
  - "Grow the sequence with append"
sources:
  - gobyexample
updated: "2026-10-16"
---

A slice is a sequence whose length can grow. It records an offset into an underlying array, plus a length and a capacity.

### Slice literals

Brackets with no length inside denote a slice.

```go run expect="2" title="Two elements"
package main

import "fmt"

func main() {
	nums := []int{8, 9}
	fmt.Println(len(nums))
}
```

The slice holds `2` elements.

### len and cap

`len` is how many elements are present. `cap` measures from the slice's start through the end of the underlying array. A new literal has equal length and capacity.

```go run expect="3 3" title="Length and capacity"
package main

import "fmt"

func main() {
	nums := []int{1, 2, 3}
	fmt.Println(len(nums), cap(nums))
}
```

Both measures print `3 3`.

### append

`append` may allocate a fresh underlying array, so assign its result back to the slice variable.

```go run expect="2 2" title="Append"
package main

import "fmt"

func main() {
	nums := []int{1}
	nums = append(nums, 2)
	fmt.Println(len(nums), nums[1])
}
```

The new length and the new element print `2 2`.

### Slice expressions

`s[low:high]` includes `low` and excludes `high`. The result shares the underlying array, so a write through either view shows up in the other.

```go run expect="9" title="A shared underlying array"
package main

import "fmt"

func main() {
	nums := []int{1, 2, 3}
	head := nums[:2]
	head[0] = 9
	fmt.Println(nums[0])
}
```

The original first element becomes `9`.
