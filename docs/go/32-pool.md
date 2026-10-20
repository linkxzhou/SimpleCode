---
language: go
chapter: 32
title: "Go 工人池"
level: advanced
minutes: 10
goals:
  - "让两个工人分掉一组任务"
  - "把通道接成加倍流水线"
  - "在任务里找出最大的数"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-20"
---

工人池是一组 goroutine 共同读取同一个任务通道。通道先装满再关闭，工人用 range 把任务取完。结果写进共享变量时仍然要加锁。

### 两个工人求和

任务 3 和 4 放进容量为 2 的通道后关闭。两个工人用 range 分着取，互斥锁累加，Wait 之后总和是 7。

```go run expect="7" title="分成两份"
package main
import ("fmt"; "sync")
func main() {
	jobs := make(chan int, 2)
	var wg sync.WaitGroup
	jobs <- 3
	jobs <- 4
	close(jobs)
	var sum int
	var mu sync.Mutex
	for i := 0; i < 2; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for n := range jobs {
				mu.Lock()
				sum += n
				mu.Unlock()
			}
		}()
	}
	wg.Wait()
	fmt.Println(sum)
}
```

### 加倍流水线

上游把 2 和 3 送进 in。一个工人把每个数乘 2 再送进 out，最后关闭 out。主函数把 4 和 6 加起来，得到 10。

```go run expect="10" title="乘二再加"
package main
import ("fmt"; "sync")
func main() {
	in := make(chan int, 2)
	out := make(chan int, 2)
	in <- 2
	in <- 3
	close(in)
	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		for n := range in {
			out <- n * 2
		}
		close(out)
	}()
	sum := 0
	for n := range out {
		sum += n
	}
	wg.Wait()
	fmt.Println(sum)
}
```

### 数完三个任务

三个 1 被单个工人加进 count。关闭之后 range 结束，Wait 返回，打印 3。

```go run expect="3" title="数到 3"
package main
import ("fmt"; "sync")
func main() {
	jobs := make(chan int, 3)
	for _, n := range []int{1, 1, 1} {
		jobs <- n
	}
	close(jobs)
	var wg sync.WaitGroup
	var mu sync.Mutex
	count := 0
	wg.Add(1)
	go func() {
		defer wg.Done()
		for n := range jobs {
			mu.Lock()
			count += n
			mu.Unlock()
		}
	}()
	wg.Wait()
	fmt.Println(count)
}
```

### 留下最大的任务

任务是 2、9、4。工人每看到更大的数就改 best。全部取完后打印 9。

```go run expect="9" title="最大是 9"
package main
import ("fmt"; "sync")
func main() {
	jobs := make(chan int, 3)
	for _, n := range []int{2, 9, 4} {
		jobs <- n
	}
	close(jobs)
	var wg sync.WaitGroup
	var mu sync.Mutex
	best := 0
	wg.Add(1)
	go func() {
		defer wg.Done()
		for n := range jobs {
			mu.Lock()
			if n > best {
				best = n
			}
			mu.Unlock()
		}
	}()
	wg.Wait()
	fmt.Println(best)
}
```
