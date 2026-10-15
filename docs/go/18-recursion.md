---
language: go
chapter: 18
title: "Go 语言递归函数"
level: intermediate
minutes: 8
goals:
  - "写出会调用自己的函数"
  - "放上一个能停下来的基准情形"
  - "用小输入观察递归结果"
sources:
  - gobyexample
updated: "2026-10-15"
---

递归是函数调用自己。必须有一个不再继续调用的分支，否则会一直占栈。

### 阶乘

`n` 的阶乘是 `n` 乘上 `n-1` 的阶乘。`1` 的阶乘是 `1`。

```go run expect="24" title="4 的阶乘"
package main

import "fmt"

func fact(n int) int {
	if n <= 1 {
		return 1
	}
	return n * fact(n-1)
}

func main() {
	fmt.Println(fact(4))
}
```

输出是 `24`。

### 基准情形

基准情形要写在递归调用之前。没有它，函数不会返回。

```go run expect="1" title="停在 1"
package main

import "fmt"

func fact(n int) int {
	if n <= 1 {
		return 1
	}
	return n * fact(n-1)
}

func main() {
	fmt.Println(fact(1))
}
```

输出是 `1`。

### 累加

从 `n` 加到 `1`，同样靠基准情形停住。

```go run expect="10" title="1 加到 4"
package main

import "fmt"

func sumTo(n int) int {
	if n <= 1 {
		return n
	}
	return n + sumTo(n-1)
}

func main() {
	fmt.Println(sumTo(4))
}
```

输出是 `10`。

### 深度要小

每一层调用都占一份栈。教程里的参数只用到个位数。很深的递归会耗尽栈，那不是这几个例子要演示的算法。

```go run expect="3" title="三层"
package main

import "fmt"

func down(n int) int {
	if n == 0 {
		return 0
	}
	return 1 + down(n-1)
}

func main() {
	fmt.Println(down(3))
}
```

输出是 `3`。
