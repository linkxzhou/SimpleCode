---
language: go
chapter: 30
title: "Go WaitGroup"
level: intermediate
minutes: 9
goals:
  - "等一个 goroutine 把数放进通道"
  - "用互斥锁把两份增量加在一起"
  - "等三个发送都结束再统计"
sources:
  - gobyexample
updated: "2026-10-20"
---

sync.WaitGroup 用来等一组 goroutine 做完。Add 增加计数，Done 减少，Wait 停到计数变成 0。共享的整数要用互斥锁保护，不能靠睡眠去碰运气。

### 等一次发送

主函数先 Add(1)，再启动发送。Wait 返回之后通道里一定已经有 4，这时接收不会空等。

```go run expect="4" title="等到 4"
package main
import ("fmt"; "sync")
func main() {
	var wg sync.WaitGroup
	ch := make(chan int, 1)
	wg.Add(1)
	go func() {
		ch <- 4
		wg.Done()
	}()
	wg.Wait()
	fmt.Println(<-ch)
}
```

### 两份增量

3 和 5 各自在一个 goroutine 里加到 sum。闭包参数 v 接住这一轮的数，互斥锁保住加法。Wait 之后总和是 8。

```go run expect="8" title="加出 8"
package main
import ("fmt"; "sync")
func main() {
	var wg sync.WaitGroup
	var mu sync.Mutex
	sum := 0
	for _, n := range []int{3, 5} {
		wg.Add(1)
		go func(v int) {
			defer wg.Done()
			mu.Lock()
			sum += v
			mu.Unlock()
		}(n)
	}
	wg.Wait()
	fmt.Println(sum)
}
```

### 三次完成

同样的写法把 1、2、4 加起来。三个 Done 都调用过之后 Wait 才返回，打印 7。

```go run expect="7" title="加出 7"
package main
import ("fmt"; "sync")
func main() {
	var wg sync.WaitGroup
	var mu sync.Mutex
	sum := 0
	for _, n := range []int{1, 2, 4} {
		wg.Add(1)
		go func(v int) {
			defer wg.Done()
			mu.Lock()
			sum += v
			mu.Unlock()
		}(n)
	}
	wg.Wait()
	fmt.Println(sum)
}
```

### 先等再关闭

三个 goroutine 各送一个 2。主函数 Wait 之后才 close，再沿通道把它们加总，得到 6。提前 close 会让还在发送的一方恐慌。

```go run expect="6" title="三个 2"
package main
import ("fmt"; "sync")
func main() {
	var wg sync.WaitGroup
	ch := make(chan int, 3)
	for _, n := range []int{2, 2, 2} {
		wg.Add(1)
		go func(v int) {
			defer wg.Done()
			ch <- v
		}(n)
	}
	wg.Wait()
	close(ch)
	total := 0
	for v := range ch {
		total += v
	}
	fmt.Println(total)
}
```
