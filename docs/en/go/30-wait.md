---
language: go
chapter: 30
title: "Go WaitGroup"
level: intermediate
minutes: 9
goals:
  - "Wait until one goroutine sends"
  - "Add two increments under a mutex"
  - "Count three sends after they finish"
sources:
  - gobyexample
updated: "2026-10-20"
---

sync.WaitGroup waits until a group of goroutines finishes. Add raises the counter, Done lowers it, and Wait blocks until the counter is zero. Protect a shared integer with a mutex instead of sleeping.

### Wait for one send

main calls Add(1) before starting the sender. After Wait returns, 4 is already in the channel, so the receive does not sit on an empty buffer.

```go run expect="4" title="Wait for 4"
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

### Two increments

3 and 5 are added to sum from their own goroutines. The parameter v captures that iteration, and the mutex guards the addition. After Wait the total is 8.

```go run expect="8" title="Sum to 8"
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

### Three completions

The same pattern adds 1, 2, and 4. Wait returns only after all three Done calls, and the print is 7.

```go run expect="7" title="Sum to 7"
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

### Wait, then close

Three goroutines each send a 2. main closes the channel only after Wait, then sums the values to 6. Closing earlier would panic a sender that is still running.

```go run expect="6" title="Three twos"
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
