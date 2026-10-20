---
language: go
chapter: 31
title: "Go context"
level: intermediate
minutes: 9
goals:
  - "Read Done after cancel"
  - "Carry a string with WithValue"
  - "See a parent cancel reach the child"
sources:
  - gobyexample
updated: "2026-10-20"
---

context carries cancellation and request-scoped values. WithCancel needs no clock: after cancel, the Done channel is closed. WithTimeout depends on a timer, so it stays reading-only here.

### Cancel closes Done

cancel runs before select. Done is already closed, so the receive succeeds at once and prints stop instead of taking default.

```go run expect="stop" title="Already canceled"
package main
import ("context"; "fmt")
func main() {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	select {
	case <-ctx.Done():
		fmt.Println("stop")
	default:
		fmt.Println("go")
	}
}
```

### Attach a string

WithValue maps the key sku to tea. Later code can read that string back with Value instead of adding another parameter.

```go run expect="tea" title="Read tea"
package main
import ("context"; "fmt")
func main() {
	ctx := context.WithValue(context.Background(), "sku", "tea")
	fmt.Println(ctx.Value("sku"))
}
```

### Parent cancel reaches the child

child is derived from parent. Canceling parent also closes child.Done, and select prints child.

```go run expect="child" title="Child stops"
package main
import ("context"; "fmt")
func main() {
	parent, cancel := context.WithCancel(context.Background())
	child, _ := context.WithCancel(parent)
	cancel()
	select {
	case <-child.Done():
		fmt.Println("child")
	default:
		fmt.Println("open")
	}
}
```

### A missing key

Background has no sku. Value returns nil and the program prints none. Do not treat that nil as a string.

```go run expect="none" title="Missing key"
package main
import ("context"; "fmt")
func main() {
	ctx := context.Background()
	if ctx.Value("sku") == nil {
		fmt.Println("none")
	}
}
```

### Timeout needs a clock

WithTimeout waits on a timer internally. Like Sleep, it never returns on this host, so it stays in a reading block. Use WithCancel for cancellation.

```go norun title="Do not run"
ctx, cancel := context.WithTimeout(context.Background(), time.Millisecond)
defer cancel()
<-ctx.Done()
```

Effective Go is linked, not copied: https://go.dev/doc/effective_go .
