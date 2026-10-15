---
language: go
chapter: 5
title: "函数与闭包"
level: intermediate
minutes: 12
goals:
  - "返回多个结果"
  - "使用可变参数"
  - "用闭包记住状态"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

多返回值常用来同时给出结果和错误，下一章会专门讲错误。可变参数在函数内部是切片。

闭包可以改外层变量。计数器每次调用都让同一份 n 增加。

```go run expect="3 2" title="多返回值"
package main

import "fmt"

func divmod(a, b int) (int, int) {
	return a / b, a % b
}

func main() {
	q, r := divmod(17, 5)
	fmt.Println(q, r)
}
```

```go run expect="6" title="可变参数"
package main

import "fmt"

func sum(nums ...int) int {
	total := 0
	for _, n := range nums {
		total += n
	}
	return total
}

func main() {
	fmt.Println(sum(1, 2, 3))
}
```

```go run expect="1" title="计数器"
package main

import "fmt"

func counter() func() int {
	n := 0
	return func() int {
		n++
		return n
	}
}

func main() {
	next := counter()
	fmt.Println(next())
	fmt.Println(next())
}
```

## 练习

用闭包做记忆化，计算 fib(8)。0,1,1,2,3,5,8,13,21 的第 8 项是 21。

::: answer 参考答案
```go run expect="21" title="参考答案"
package main

import "fmt"

func main() {
	mem := map[int]int{0: 0, 1: 1}
	var fib func(int) int
	fib = func(n int) int {
		if v, ok := mem[n]; ok {
			return v
		}
		mem[n] = fib(n-1) + fib(n-2)
		return mem[n]
	}
	fmt.Println(fib(8))
}
```
:::

## 常见错误

- 可变参数再传给另一个可变参数时忘记用 ...。
- 闭包里的循环变量在旧版本会共享。这里的计数器不依赖循环变量。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
