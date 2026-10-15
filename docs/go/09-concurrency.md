---
language: go
chapter: 9
title: "goroutine 与 channel"
level: advanced
minutes: 18
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

go 关键字启动一个 goroutine。channel 用来把值交出去。无缓冲 channel 的发送和接收必须都准备好，否则发送方会停住。缓冲为 1 时，可以先发送一次再接收。示例用缓冲，避免在单线程调度里互相卡住。

Yaegi 在一个线程里轮流跑这些 goroutine。它能演示「发出去、收得到」，不能用来证明并行加速，也不要写 time.Sleep 等待对方。需要交接就用 channel，不要用睡眠碰运气。

close 告诉接收方没有更多的值。只有发送方应该关闭。接收方用 range 会一直读到关闭。忘记关闭，range 就不会结束。关闭一个已经关闭的 channel 会 panic，所以谁负责关闭要只有一方。

select 可以等多个 channel。它在 Yaegi 上和官方编译器容易不一致，文档里标成只读。能跑的例子只用一个 channel，把收发放在看得见的几行里。

缓冲大小是「可以先放进去、还不必有人接收」的个数。缓冲为 1 就只能先放一个。放第二个而没人接收，仍会卡住。示例每次只放一个，或在同一个 main 里先放满再关再读。

goroutine 里的发送如果发生在接收之后才被调度，无缓冲也可能成功。不要依赖这个时机。教学代码宁可多写一个缓冲，换取「放得进去」。

range channel 在关闭后把剩余值读完就结束。没有关闭就永远等。测试会超时或一直占着运行时。发送方在发完最后一条后立刻 close。

go 关键字启动一个 goroutine。channel 用来交接值。无缓冲 channel 的发送和接收必须都准备好，否则这一侧会停住。在单线程的协作调度里，无缓冲很容易互相卡住。演示收发时用缓冲，容量至少为 1，先发送再在同一个 main 里接收。缓冲为 1 就只能先放一个，放第二个而没人接收，仍会卡住。

不要用 time.Sleep 排列先后。这里不保证真实睡眠，也不用睡眠证明并发。需要交接就用 channel。close 告诉接收方没有更多的值，只能由发送方关闭。接收方用 range 会读到关闭为止。忘记关闭，range 就不会结束，测试会停住。关闭一个已经关闭的 channel 会 panic，谁负责关闭要只有一方。

select 在这个解释器和官方编译器上容易不一致，文档里不放进自动测试。能跑的例子只用一个 channel，把收发放在看得见的几行里。从文档运行带 goroutine 的示例时，确认主函数会收到结果并打印，而不是启动之后就返回。主函数返回，没来得及跑的 goroutine 不会把输出补给你。

### 读「缓冲后接收」

先做这一例。代码收成一行是 `package main import "fmt" func main() { ch := make(chan int, 1) ch <- 42 fmt.Println(<-ch) }`。先盖住终端，用手算结果，纸上的文本里要能找到「42」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「42」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「关闭后 range」

做完上一个再做这一例。代码收成一行是 `package main import "fmt" func main() { ch := make(chan int, 2) ch <- 1 ch <- 2 close(ch) sum := 0 for n := range ch { sum += n } fmt.Println(sum) }`。先盖住终端，用手算结果，纸上的文本里要能找到「3」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「3」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：用带缓冲的 channel 演示收发，避免无缓冲在单线程里卡住。 用「缓冲后接收」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：发送 7」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：只由发送方关闭 channel，接收方用 range 读到结束。 用「关闭后 range」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：发送 7」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：不靠 time.Sleep 排列先后，也不把 select 放进自动测试。 用「缓冲后接收」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：发送 7」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：容量为 1 的 channel 发送 7 再接收并打印。不必启动 goroutine。 做完再对照「参考答案：发送 7」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：goroutine 和 channel 用通信交接数据。这里是协作调度，缓冲和关闭决定会不会卡住或停不下来。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```go run expect="42" title="缓冲后接收"
package main

import "fmt"

func main() {
	ch := make(chan int, 1)
	ch <- 42
	fmt.Println(<-ch)
}
```

```go run expect="3" title="关闭后 range"
package main

import "fmt"

func main() {
	ch := make(chan int, 2)
	ch <- 1
	ch <- 2
	close(ch)
	sum := 0
	for n := range ch {
		sum += n
	}
	fmt.Println(sum)
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

容量为 1 的 channel 发送 7 再接收并打印。不必启动 goroutine。

::: answer 参考答案：发送 7
```go run expect="7" title="参考答案"
package main

import "fmt"

func main() {
	ch := make(chan int, 1)
	ch <- 7
	fmt.Println(<-ch)
}
```
:::

## 最佳实践

- 用带缓冲的 channel 演示收发，避免无缓冲在单线程里卡住。
- 只由发送方关闭 channel，接收方用 range 读到结束。
- 不靠 time.Sleep 排列先后，也不把 select 放进自动测试。

## 小结

goroutine 和 channel 用通信交接数据。这里是协作调度，缓冲和关闭决定会不会卡住或停不下来。

## 常见错误

- 对无缓冲 channel 先发送、没有人接收，程序会一直停着。
- 忘记 close 就 range channel。发送方不再发送时要关闭，否则接收循环不结束。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
