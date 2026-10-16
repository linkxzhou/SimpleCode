---
language: go
chapter: 5
title: "Go 语言变量"
level: beginner
minutes: 8
goals:
  - "用 var 声明变量"
  - "认出零值"
  - "在函数里使用 :="
sources:
  - gobyexample
updated: "2026-10-15"
---

变量保存可以改变的值。声明之后必须在同一函数里用到，否则编译失败。

### var 声明

`var` 后面是名字和类型。可以在声明时赋初值，也可以稍后再赋。

```go run expect="tea" title="指定类型"
package main

import "fmt"

func main() {
	var item string
	item = "tea"
	fmt.Println(item)
}
```

输出是 `tea`。

### 零值

没有初值时，变量取类型的零值，而不是随机数。

```go run expect="0 false" title="零值"
package main

import "fmt"

func main() {
	var n int
	var ok bool
	fmt.Println(n, ok)
}
```

输出是 `0 false`。

### 短声明

函数内部可以用 `:=` 声明并赋值，类型由右边推断。包一级不能使用 `:=`。

```go run expect="hangzhou" title="短声明"
package main

import "fmt"

func main() {
	city := "hangzhou"
	fmt.Println(city)
}
```

输出是 `hangzhou`。

注意：同一个块里对已有名字再写 `:=`，且左边没有新名字，会报 *no new variables*。

### 一次声明多个

左边和右边按位置对应。`_` 丢掉不需要的那个值。

```go run expect="7" title="空白标识符"
package main

import "fmt"

func main() {
	_, b := 5, 7
	fmt.Println(b)
}
```

输出是 `7`。`5` 被丢掉。
