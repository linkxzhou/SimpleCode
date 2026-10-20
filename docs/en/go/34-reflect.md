---
language: go
chapter: 34
title: "Go reflect"
level: advanced
minutes: 9
goals:
  - "Read the Qty field of a struct"
  - "Count the fields"
  - "Change an integer through a pointer"
sources:
  - gobyexample
updated: "2026-10-20"
---

reflect inspects types and values at run time. Another package can read only exported fields. These fields live in main, so a capital name is enough. SetInt needs Elem on a pointer, because a plain value cannot be changed.

### Read the quantity

Qty on Item is 4. FieldByName finds that field, Int turns it into an int64, and Println writes 4.

```go run expect="4" title="Field Qty"
package main
import ("fmt"; "reflect")
type Item struct {
	Name string
	Qty  int
}
func main() {
	v := reflect.ValueOf(Item{"tea", 4})
	fmt.Println(v.FieldByName("Qty").Int())
}
```

### There are two fields

Name and Qty each count as one field. NumField returns 2. Unexported lowercase fields would be hidden from another package. This struct has none.

```go run expect="2" title="Two fields"
package main
import ("fmt"; "reflect")
type Item struct {
	Name string
	Qty  int
}
func main() {
	t := reflect.TypeOf(Item{})
	fmt.Println(t.NumField())
}
```

### Replace the original 1

ValueOf takes the address of item, and Elem is the settable struct. After SetInt(9), item.Qty is 9.

```go run expect="9" title="Set to 9"
package main
import ("fmt"; "reflect")
type Item struct {
	Name string
	Qty  int
}
func main() {
	item := Item{"tea", 1}
	p := reflect.ValueOf(&item).Elem()
	p.FieldByName("Qty").SetInt(9)
	fmt.Println(item.Qty)
}
```

### The kind of an integer

TypeOf(4).Kind is int. Printing the string form yields int, not the name of a variable.

```go run expect="int" title="Kind int"
package main
import ("fmt"; "reflect")
func main() {
	fmt.Println(reflect.TypeOf(4).Kind().String())
}
```

### Read the name

The Name field of the same struct is tea. String reads the text of that exported field.

```go run expect="tea" title="Field Name"
package main
import ("fmt"; "reflect")
type Item struct {
	Name string
	Qty  int
}
func main() {
	v := reflect.ValueOf(Item{"tea", 4})
	fmt.Println(v.FieldByName("Name").String())
}
```
