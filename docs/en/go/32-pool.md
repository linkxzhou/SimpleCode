---
language: go
chapter: 32
title: "Go worker pool"
level: advanced
minutes: 10
goals:
  - "Let two workers share a job list"
  - "Double values in a channel pipeline"
  - "Find the largest job"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-20"
---

A worker pool is a set of goroutines reading one job channel. Fill the channel, close it, and let each worker range until it is empty. Still lock any shared result.

### Two workers add

Jobs 3 and 4 go into a capacity-2 channel, which is then closed. Two workers range over it, the mutex accumulates, and Wait prints 7.

```go run expect="7" title="Split the work"
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

### A doubling pipeline

The upstream stage sends 2 and 3 into in. One worker multiplies each value by 2 and sends it to out, then closes out. main adds 4 and 6 and gets 10.

```go run expect="10" title="Double then add"
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

### Count three jobs

A single worker adds three 1 values into count. After close, range ends, Wait returns, and the print is 3.

```go run expect="3" title="Count to 3"
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

### Keep the largest job

The jobs are 2, 9, and 4. The worker updates best whenever it sees a larger number. After the channel is drained the print is 9.

```go run expect="9" title="Largest is 9"
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
