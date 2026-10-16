---
language: go
chapter: 13
title: "Go Pointers"
level: intermediate
minutes: 8
goals:
  - "Take an address with &"
  - "Read and update the target with *"
  - "Keep a nil pointer from being dereferenced"
sources:
  - gobyexample
updated: "2026-10-16"
---

A pointer variable stores where another variable lives. Writing through that address changes the original.

### Taking an address

Place `&` before a variable to obtain a pointer to it. The pointer's type is written `*T`.

```go run expect="9" title="Pointer to the original variable"
package main

import "fmt"

func main() {
	n := 9
	p := &n
	fmt.Println(*p)
}
```

The value at that address is `9`.

### Writing through a pointer

`*` applied to a pointer names the variable it addresses. Assigning there updates that variable.

```go run expect="8" title="Assign through a dereference"
package main

import "fmt"

func main() {
	n := 3
	p := &n
	*p = 8
	fmt.Println(n)
}
```

After the write, `n` itself is `8`.

### Pointer parameters

A pointer parameter lets the function update the caller's variable. Passing the integer updates only a copy.

```go run expect="11" title="Add one inside the function"
package main

import "fmt"

func inc(p *int) {
	*p = *p + 1
}

func main() {
	n := 10
	inc(&n)
	fmt.Println(n)
}
```

Ten plus one prints `11`.

### Nil pointers

A pointer declared with no target is `nil`. Dereferencing it panics.

```go run expect="空指针" title="Check before use"
package main

import "fmt"

func main() {
	defer func() {
		if recover() != nil {
			fmt.Println("空指针")
		}
	}()
	var p *int
	fmt.Println(*p)
}
```

The recovered message is `空指针`. Test `p != nil` before the dereference.
