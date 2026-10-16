---
language: go
chapter: 14
title: "Go Structures"
level: intermediate
minutes: 8
goals:
  - "Group fields in a struct"
  - "Fill those fields with a composite literal"
  - "Attach a method to the structure"
sources:
  - gobyexample
updated: "2026-10-16"
---

A structure collects fields into one type. A field whose name starts with a capital letter is visible to other packages.

### Defining a struct

`type` gives the structure a name. Each field occupies one line, name first and type after.

```go run expect="茶" title="Read a field"
package main

import "fmt"

type Item struct {
	Name  string
	Price int
}

func main() {
	var it Item
	it.Name = "茶"
	fmt.Println(it.Name)
}
```

The name field is `茶`. `Price` was never set, so it stays 0.

### Composite literals

Write the field name, a colon, and the value. Field order may differ from the declaration. A field you skip stays at zero.

```go run expect="18" title="Named fields"
package main

import "fmt"

type Item struct {
	Name  string
	Price int
}

func main() {
	it := Item{Name: "茶", Price: 18}
	fmt.Println(it.Price)
}
```

The price field is `18`.

### Value receivers

The receiver appears before the method name. A value receiver works on a copy of the structure.

```go run expect="茶 18" title="A method"
package main

import "fmt"

type Item struct {
	Name  string
	Price int
}

func (it Item) Label() string {
	return it.Name
}

func main() {
	it := Item{Name: "茶", Price: 18}
	fmt.Println(it.Label(), it.Price)
}
```

The label and the price print `茶 18`.

### Pointer receivers

Changing a field inside a method calls for a pointer receiver. The call names the variable. You do not write `&` by hand.

```go run expect="20" title="Change the price"
package main

import "fmt"

type Item struct {
	Price int
}

func (it *Item) Raise(n int) {
	it.Price += n
}

func main() {
	it := Item{Price: 18}
	it.Raise(2)
	fmt.Println(it.Price)
}
```

After the raise the price is `20`.
