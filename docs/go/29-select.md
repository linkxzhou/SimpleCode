---
language: go
chapter: 29
title: "Go select"
level: intermediate
minutes: 9
goals:
  - "从两个通道里取已经就绪的值"
  - "用 default 在空通道上立刻返回"
  - "用循环把缓冲里的数取完"
sources:
  - gobyexample
updated: "2026-10-20"
---

select 同时查看多个通道操作。只有已经能发送或接收的 case 才会被选中。这一页不使用计时器，因为 time.After 和 time.Sleep 会停在宿主的 poll_oneoff 上。

### 先就绪的通道

左边的缓冲通道已经放进 tea，右边仍是空的。select 只会走上能立刻接收的那一支，所以打印 tea。

```go run expect="tea" title="取 tea"
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

### 空通道走 default

容量为 1 的通道里什么都没有。没有 default 时接收会一直等。加上 default 后，这一轮马上结束并打印 idle。

```go run expect="idle" title="立刻返回"
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

### 缓冲有空位就可以发送

发送同样可以放进 select。缓冲还空着，所以 8 被放进去，紧接着再取出来打印。

```go run expect="8" title="送入 8"
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

### 把缓冲取干

循环里的 select 先把 6 取走。通道变空后走 default，打印累计的 6 并 return。这样不会停在下一次接收上。

```go run expect="6" title="取完就停"
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

### 计时器读不回来

time.Sleep 和 time.After 都要等时钟。这个宿主的 poll_oneoff 对时钟订阅是忙等，和 Go 运行时对不上，短睡眠也不会结束。下面这段只供阅读。

```go norun title="不要运行"
time.Sleep(time.Millisecond)
fmt.Println(<-time.After(time.Millisecond))
```

延伸阅读：《Go程序设计语言》 https://book.douban.com/subject/27044219 。书里的超时例子依赖计时器，这里改成 default。
