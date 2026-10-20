---
language: go
chapter: 33
title: "Go 检查函数"
level: intermediate
minutes: 9
goals:
  - "用 if 判断加法是否等于 5"
  - "把失败次数打出来"
  - "沿一张小表检查两行"
sources:
  - learn-go-tests
  - gobyexample
updated: "2026-10-20"
---

go test 需要测试运行器，Yaegi 只解释当前这份 main，不会去发现 Test 开头的函数。检查写成普通函数，由 main 调用，失败时打印数字而不是靠退出码框架。

### 加法等于 5

add(2, 3) 应该是 5。相等就打印 ok，不相等就打印 fail 并返回。

```go run expect="ok" title="检查加法"
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

### 数出失败

1 加 1 不是 3，bad 从 0 变成 1。这个程序故意写错期望，用来看失败计数，而不是让进程崩溃。

```go run expect="1" title="一次失败"
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

### 两行都通过

表里第一行是 2+3=5，第二行是 1+4=5。循环数出通过的行数，打印 2。

```go run expect="2" title="两行通过"
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

### 乘法检查

mul(2, 4) 等于 8 时打印 pass。这是同一份 main 里的练习，不另开测试文件。

```go run expect="pass" title="二乘四"
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

### go test 不会启动

命令 go test 不是这份源码的一部分，解释器也不会扫描测试函数。下面的命令只供阅读。

```go norun title="命令不运行"
go test ./...
```

Learn Go with Tests 是 MIT，思路可参考，用例是这里另写的：https://github.com/quii/learn-go-with-tests 。
