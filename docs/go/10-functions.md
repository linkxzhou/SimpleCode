---
language: go
chapter: 10
title: "Go 语言函数"
level: beginner
minutes: 8
goals:
  - "声明带参数和返回值的函数"
  - "一次返回多个结果"
  - "用 defer 在函数退出时收尾"
sources:
  - gobyexample
updated: "2026-10-15"
---

函数把一段计算收成一个名字。参数和返回值都要写类型。

### 定义和调用

参数写在括号里，返回类型写在括号后面。

```go run expect="5" title="两数相加"
package main

import "fmt"

func add(a, b int) int {
	return a + b
}

func main() {
	fmt.Println(add(2, 3))
}
```

输出是 `5`。

### 多个返回值

括号里列出每个返回值的类型。调用处用逗号同时接收。

```go run expect="2 1" title="商和余数"
package main

import "fmt"

func div(a, b int) (int, int) {
	return a / b, a % b
}

func main() {
	q, r := div(5, 2)
	fmt.Println(q, r)
}
```

输出是 `2 1`。

### 可变参数

参数类型前的 `...` 表示可以传入零个或多个该类型的值，函数里把它当成切片。

```go run expect="6" title="求和"
package main

import "fmt"

func total(xs ...int) int {
	n := 0
	for _, x := range xs {
		n += x
	}
	return n
}

func main() {
	fmt.Println(total(1, 2, 3))
}
```

输出是 `6`。

### defer

`defer` 把调用推迟到当前函数返回前，后注册的先执行。

```go run expect="021" title="推迟的顺序"
package main

import "fmt"

func main() {
	defer fmt.Print(1)
	defer fmt.Print(2)
	fmt.Print(0)
}
```

输出是 `021`。先打印 0，返回时先执行后一个 `defer`。
