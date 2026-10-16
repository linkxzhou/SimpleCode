---
language: go
chapter: 12
title: "Go Arrays"
level: beginner
minutes: 8
goals:
  - "Declare an array whose length is fixed"
  - "Read and write an element by index"
  - "Expect assignment to copy every element"
sources:
  - gobyexample
updated: "2026-10-16"
---

Length belongs to the array type. `[2]int` and `[3]int` are different types.

### Declaring an array

The length sits in brackets before the element type. Any element you leave out is the zero value.

```go run expect="0" title="A default element"
package main

import "fmt"

func main() {
	var nums [3]int
	fmt.Println(nums[2])
}
```

The last slot prints `0`.

### Indexes

The lowest index is 0. `len` reports how many elements the declaration reserved.

```go run expect="20 3" title="Read and write an index"
package main

import "fmt"

func main() {
	temps := [3]int{18, 20, 19}
	fmt.Println(temps[1], len(temps))
}
```

The middle temperature and the length print `20 3`.

### Assignment copies the array

Storing an array in another variable copies every element. Editing the copy leaves the source array alone.

```go run expect="4 1" title="Copy an array"
package main

import "fmt"

func main() {
	a := [2]int{4, 5}
	b := a
	b[0] = 1
	fmt.Println(a[0], b[0])
}
```

The original and the copy print `4 1`.

### Lengths must match

The compiler counts the length as part of the type. The next lines are only for reading, because they do not compile.

```go norun title="Length is part of the type"
var a [2]int
var b [3]int
a = b
```

When the length has to be able to change, use the slice from the next chapter instead of declaring a larger array.
