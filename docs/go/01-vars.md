---
language: go
chapter: 1
title: "包、变量与常量"
level: beginner
minutes: 12
goals:
  - "用 := 声明并赋值"
  - "定义 const 和 iota"
  - "做一次单位换算"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

`:=` 在函数里同时声明和赋值，类型由右边推断。`const` 是编译期就定下来的名字。`iota` 在一组常量里从 0 开始数。

包级变量用 `var`。短声明只能出现在函数内部。

```go run expect="Ada" title="名片"
package main

import "fmt"

const boiling = 100

func main() {
	name := "Ada"
	fmt.Println(name)
	fmt.Println(boiling*9/5 + 32)
}
```

```go run expect="0 1 2" title="iota"
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

```go run expect="2000" title="单位换算"
package main

import "fmt"

func main() {
	km := 2
	fmt.Println(km * 1000)
}
```

## 练习

把 3 英寸换成厘米（1 英寸 = 254 / 100 厘米，用整数 254/100），打印结果。

::: answer 参考答案
```go run expect="7" title="参考答案"
package main

import "fmt"

func main() {
	fmt.Println(3 * 254 / 100)
}
```
:::

## 常见错误

- 在函数外使用 :=。短声明只属于函数内部。
- iota 写在单独的 const 里却以为会继续加。每组 const 都会重新从 0 开始。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
