---
language: go
chapter: 29
title: "Go select"
level: intermediate
minutes: 9
goals:
  - "Take the value that is already ready"
  - "Return at once through default"
  - "Drain a buffered channel in a loop"
sources:
  - gobyexample
updated: "2026-10-20"
---

select watches several channel operations at once. Only a case that can send or receive immediately is chosen. This page skips timers, because time.After and time.Sleep stall on the host poll_oneoff.

### The ready channel

The left buffer already holds tea and the right one is empty. select takes the receive that can finish now, so the line is tea.

```go run expect="tea" title="Take tea"
package main
import "fmt"
func main() {
	a := make(chan string, 1)
	b := make(chan string, 1)
	a <- "tea"
	select {
	case v := <-a:
		fmt.Println(v)
	case v := <-b:
		fmt.Println(v)
	}
}
```

### default on an empty channel

A capacity-1 channel holds nothing. A receive without default would wait forever. With default, this turn ends immediately and prints idle.

```go run expect="idle" title="Return immediately"
package main
import "fmt"
func main() {
	ch := make(chan int, 1)
	select {
	case v := <-ch:
		fmt.Println(v)
	default:
		fmt.Println("idle")
	}
}
```

### Send when the buffer has room

A send can sit in select too. The buffer still has room, so 8 is stored and then printed on the next receive.

```go run expect="8" title="Send 8"
package main
import "fmt"
func main() {
	ch := make(chan int, 1)
	select {
	case ch <- 8:
		fmt.Println(<-ch)
	default:
		fmt.Println(0)
	}
}
```

### Drain the buffer

The select inside the loop takes 6 first. Once the channel is empty, default prints the total 6 and returns, so the next receive never blocks.

```go run expect="6" title="Stop when empty"
package main
import "fmt"
func main() {
	ch := make(chan int, 1)
	ch <- 6
	n := 0
	for {
		select {
		case v := <-ch:
			n += v
		default:
			fmt.Println(n)
			return
		}
	}
}
```

### Timers do not return

time.Sleep and time.After both wait on a clock. This host busy-waits clock subscriptions inside poll_oneoff, and that does not match the Go runtime, so even a short sleep never finishes. The fragment below is for reading only.

```go norun title="Do not run"
time.Sleep(time.Millisecond)
fmt.Println(<-time.After(time.Millisecond))
```

Further reading: The Go Programming Language, https://book.douban.com/subject/27044219 . Its timeout samples need a timer, so this page uses default instead.
