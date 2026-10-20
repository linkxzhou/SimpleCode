---
language: go
chapter: 33
title: "Go check functions"
level: intermediate
minutes: 9
goals:
  - "Check that addition equals 5"
  - "Print how many checks failed"
  - "Walk a tiny table of two rows"
sources:
  - learn-go-tests
  - gobyexample
updated: "2026-10-20"
---

go test needs a test runner. Yaegi only interprets this main file and does not discover functions named Test. Write checks as ordinary functions that main calls, and print a number when one fails.

### Addition equals 5

add(2, 3) should be 5. Equality prints ok. A mismatch prints fail and returns.

```go run expect="ok" title="Check addition"
package main
import "fmt"
func add(a, b int) int { return a + b }
func main() {
	if add(2, 3) != 5 {
		fmt.Println("fail")
		return
	}
	fmt.Println("ok")
}
```

### Count a failure

1 plus 1 is not 3, so bad moves from 0 to 1. The expected value is wrong on purpose, so the failure is counted instead of crashing the process.

```go run expect="1" title="One failure"
package main
import "fmt"
func add(a, b int) int { return a + b }
func main() {
	bad := 0
	if add(1, 1) != 3 {
		bad++
	}
	fmt.Println(bad)
}
```

### Both rows pass

The first row is 2+3=5 and the second is 1+4=5. The loop counts passing rows and prints 2.

```go run expect="2" title="Two rows pass"
package main
import "fmt"
func add(a, b int) int { return a + b }
func main() {
	cases := []struct {
		a, b, want int
	}{{2, 3, 5}, {1, 4, 5}}
	pass := 0
	for _, c := range cases {
		if add(c.a, c.b) == c.want {
			pass++
		}
	}
	fmt.Println(pass)
}
```

### A multiplication check

When mul(2, 4) equals 8 the program prints pass. This exercise stays in the same main file. There is no separate test file.

```go run expect="pass" title="Two times four"
package main
import "fmt"
func mul(a, b int) int { return a * b }
func main() {
	if mul(2, 4) == 8 {
		fmt.Println("pass")
		return
	}
	fmt.Println("fail")
}
```

### go test does not start

The go test command is not part of this source, and the interpreter does not scan for test functions. The line below is for reading only.

```go norun title="Command is not run"
go test ./...
```

Learn Go with Tests is MIT. The idea is fair to reuse; these cases are written for this page: https://github.com/quii/learn-go-with-tests .
