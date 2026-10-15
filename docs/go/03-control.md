---
language: go
chapter: 3
title: "控制流"
level: beginner
minutes: 12
goals:
  - "写 if、for 和 switch"
  - "用 defer 推迟调用"
  - "判断质数"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

Go 只有 `for` 一种循环。条件两边不要加括号。`switch` 默认每个分支结束就离开，不用写 break。

`defer` 把调用推迟到当前函数返回前，多个 defer 按后进先出执行。

```go run expect="1 2 Fizz 4 Buzz Fizz 7" title="FizzBuzz"
package main

import "fmt"

func main() {
	for n := 1; n <= 7; n++ {
		switch {
		case n%15 == 0:
			fmt.Print("FizzBuzz ")
		case n%3 == 0:
			fmt.Print("Fizz ")
		case n%5 == 0:
			fmt.Print("Buzz ")
		default:
			fmt.Print(n, " ")
		}
	}
	fmt.Println()
}
```

```go run expect="质数" title="质数"
package main

import "fmt"

func prime(n int) bool {
	if n < 2 {
		return false
	}
	for i := 2; i*i <= n; i++ {
		if n%i == 0 {
			return false
		}
	}
	return true
}

func main() {
	if prime(5) {
		fmt.Println("质数")
	}
}
```

```go run expect="abc" title="defer"
package main

import "fmt"

func main() {
	fmt.Print("a")
	defer fmt.Print("c")
	fmt.Print("b")
	fmt.Println()
}
```

## 练习

用 for 打印 3、2、1。

::: answer 参考答案
```go run expect="3\n2\n1" title="参考答案"
package main

import "fmt"

func main() {
	for n := 3; n >= 1; n-- {
		fmt.Println(n)
	}
}
```
:::

## 常见错误

- 把 while 写成关键字。Go 里就是 for 条件 { }。
- defer 写在循环里打开很多资源。它们要等到函数结束才执行。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
