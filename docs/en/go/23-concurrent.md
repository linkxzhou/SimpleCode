---
language: go
chapter: 23
title: "Go Concurrency"
level: advanced
minutes: 10
goals:
  - "Start a goroutine with go"
  - "Send one integer on a buffered channel"
  - "Use default in select so a receive does not block"
sources:
  - gobyexample
updated: "2026-10-16"
---

A function started with `go` runs at the same time as `main`. Channels carry values between them. None of these samples waits with `time.Sleep`.

### goroutine

The `go` keyword prefixes a call. The call returns immediately, and the function body runs on another goroutine.

```go run expect="42" title="Receive one number"
package main

import "fmt"

func main() {
	ch := make(chan int, 1)
	go func() {
		ch <- 42
	}()
	fmt.Println(<-ch)
}
```

Capacity 1 lets the send finish before a receiver is waiting. The received number is `42`.

### An unbuffered channel stalls

Capacity 0 means a send proceeds only while some other goroutine is receiving. Sending and then receiving in that same goroutine waits forever.

```go norun title="Deadlock in the same goroutine"
ch := make(chan int)
ch <- 1
fmt.Println(<-ch)
```

Runnable samples either give the channel a capacity of at least 1 or start a second goroutine before the send.

### Receiving a value

`<-ch` takes one value out of the channel. In the earlier sample, `main` pauses on that line until 42 arrives.

```go run expect="7" title="Send, then receive"
package main

import "fmt"

func main() {
	ch := make(chan int, 1)
	ch <- 7
	fmt.Println(<-ch)
}
```

No second goroutine is required here, because the buffer accepts 7 first. The taken value is `7`.

### default in select

`select` can wait on several channel operations at once. `default` runs immediately when every other case is blocked.

```go run expect="empty" title="Nothing waiting"
package main

import "fmt"

func main() {
	ch := make(chan int, 1)
	select {
	case v := <-ch:
		fmt.Println(v)
	default:
		fmt.Println("empty")
	}
}
```

With an empty buffer the chosen word is `empty`.
