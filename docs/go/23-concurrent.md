---
language: go
chapter: 23
title: "Go 并发"
level: advanced
minutes: 10
goals:
  - "用 go 启动一个 goroutine"
  - "用带缓冲的通道传递一个整数"
  - "用 select 的 default 避免阻塞"
sources:
  - gobyexample
updated: "2026-10-15"
---

`go` 启动的函数和 `main` 并发执行。通道用来在它们之间传递值。这里不靠 `time.Sleep` 碰运气。

### goroutine

`go` 后面是一次函数调用。它会马上返回，被调用的函数在另一个 goroutine 里跑。

```go run expect="42" title="收到一个数"
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

输出是 `42`。容量为 1，发送方不必等接收方已经在等。

### 无缓冲会卡住

容量为 0 时，发送要等对面正在接收。在同一个 goroutine 里先发送再接收，会永远等下去。

```go norun title="同一 goroutine 里会死锁"
ch := make(chan int)
ch <- 1
fmt.Println(<-ch)
```

可运行例子都使用容量至少为 1 的通道，或先启动另一个 goroutine。

### 接收

`<-ch` 从通道取出一个值。上面的 `main` 会停在这一行，直到 42 放进来。

```go run expect="7" title="先放入再取出"
package main

import "fmt"

func main() {
	ch := make(chan int, 1)
	ch <- 7
	fmt.Println(<-ch)
}
```

输出是 `7`。这一次没有另起 goroutine，因为缓冲能先收下这个数。

### select 的 default

`select` 可以同时等多个通道。没有任何 case 能进行时，`default` 立刻执行。

```go run expect="empty" title="没有数据"
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

输出是 `empty`。
