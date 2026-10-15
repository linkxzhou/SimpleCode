---
language: go
chapter: 9
title: "goroutine 与 channel"
level: advanced
minutes: 12
goals:
  - "用 channel 传递一个值"
  - "理解缓冲避免立刻阻塞"
  - "知道这里是协作调度而不是多核并行"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

`go` 启动一个 goroutine。channel 用来交接数据。无缓冲 channel 的发送和接收必须碰面；缓冲为 1 时，发送可以先放进去。

Yaegi 在单线程里调度这些 goroutine，能演示通信，不代表并行加速。不要依赖 `time.Sleep` 的真实等待。

```go run expect="42" title="交接一个数"
package main

import "fmt"

func main() {
	ch := make(chan int, 1)
	go func() { ch <- 42 }()
	fmt.Println(<-ch)
}
```

```go run expect="ab" title="缓冲与关闭"
package main

import "fmt"

func main() {
	ch := make(chan string, 2)
	ch <- "a"
	ch <- "b"
	close(ch)
	for v := range ch {
		fmt.Print(v)
	}
	fmt.Println()
}
```

::: note
更复杂的 select 扇入在 Yaegi 上容易和官方编译器不一致。下面只给阅读，不在自动测试里运行。
:::

```go norun title="只读：select"
package main

func main() {
	// select 多路扇入请在本地 Go 工具链里试验。
}
```

## 练习

用容量为 1 的 channel 发送 `"ok"` 再接收并打印。可以不用 goroutine。

::: answer 参考答案
```go run expect="ok" title="参考答案"
package main

import "fmt"

func main() {
	ch := make(chan string, 1)
	ch <- "ok"
	fmt.Println(<-ch)
}
```
:::

## 常见错误

- 对无缓冲 channel 先发送、没有人接收，程序会一直停着。
- 忘记 close 就 range channel。发送方不再发送时要关闭，否则接收循环不结束。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
