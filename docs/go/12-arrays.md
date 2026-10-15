---
language: go
chapter: 12
title: "Go 语言数组"
level: beginner
minutes: 8
goals:
  - "声明固定长度的数组"
  - "用下标读写元素"
  - "知道赋值会复制整个数组"
sources:
  - gobyexample
updated: "2026-10-15"
---

数组的长度是类型的一部分。`[2]int` 和 `[3]int` 不是同一种类型。

### 声明

长度写在类型前面的方括号里。未写出的元素是零值。

```go run expect="0" title="默认元素"
package main

import "fmt"

func main() {
	var nums [3]int
	fmt.Println(nums[2])
}
```

输出是 `0`。

### 下标

下标从 0 开始。`len` 返回元素个数，也就是声明时的长度。

```go run expect="20 3" title="读写下标"
package main

import "fmt"

func main() {
	temps := [3]int{18, 20, 19}
	fmt.Println(temps[1], len(temps))
}
```

输出是 `20 3`。

### 数组是值

把数组赋给另一个变量，会复制全部元素。改副本不会影响原来的数组。

```go run expect="4 1" title="复制数组"
package main

import "fmt"

func main() {
	a := [2]int{4, 5}
	b := a
	b[0] = 1
	fmt.Println(a[0], b[0])
}
```

输出是 `4 1`。

### 长度不同就不能赋值

编译器把长度算进类型。下面两行不能通过编译，所以只作阅读。

```go norun title="长度是类型的一部分"
var a [2]int
var b [3]int
a = b
```

需要可变长度时使用下一章的切片，而不是再声明一个更大的数组。
