---
language: go
chapter: 6
title: "Go 语言常量"
level: beginner
minutes: 8
goals:
  - "用 const 声明不会改变的值"
  - "把一组常量写在括号里"
  - "用 iota 生成递增序号"
sources:
  - gobyexample
updated: "2026-10-15"
---

常量在编译期就确定，运行时不能再赋值。

### 单个常量

`const` 的写法类似 `var`，但必须有初值，并且初值是常量表达式。

```go run expect="100" title="沸点"
package main

import "fmt"

func main() {
	const boiling = 100
	fmt.Println(boiling)
}
```

输出是 `100`。

### 成组声明

括号把相关常量放在一起。省略的类型和表达式会沿用上一行。

```go run expect="60 60" title="成组常量"
package main

import "fmt"

const (
	minute = 60
	second = minute
)

func main() {
	fmt.Println(minute, second)
}
```

输出是 `60 60`。

### iota

`iota` 在每一组 `const` 里从 0 开始，每下一行加 1。适合写一组序号，而不是手写 0、1、2。

```go run expect="0 1 2" title="iota 序号"
package main

import "fmt"

const (
	red = iota
	green
	blue
)

func main() {
	fmt.Println(red, green, blue)
}
```

输出是 `0 1 2`。

注意：新的 `const (` 会把 `iota` 重新清回 0。
