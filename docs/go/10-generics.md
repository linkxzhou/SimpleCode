---
language: go
chapter: 10
title: "泛型"
level: advanced
minutes: 12
goals:
  - "写出一个类型参数"
  - "知道 Yaegi 只适合简单泛型"
  - "把复杂约束留在本地工具链"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

类型参数写在函数名后面的方括号里。`T any` 表示任何类型。简单的恒等函数用来确认这条路径能跑。

Yaegi 0.16 对泛型的支持有限。带复杂约束、类型推断嵌套或泛型数据结构的代码标成只读，请在官方 `go` 命令里试验。

```go run expect="42" title="恒等函数"
package main

import "fmt"

func Identity[T any](v T) T {
	return v
}

func main() {
	fmt.Println(Identity(42))
}
```

```go run expect="y" title="取第二个"
package main

import "fmt"

func Second[T any](a, b T) T {
	return b
}

func main() {
	fmt.Println(Second("x", "y"))
}
```

```go norun title="复杂泛型"
package main

// 只读：带自定义约束的泛型栈在 Yaegi 0.16 上不可靠。
// func Push[T any](s []T, v T) []T { return append(s, v) }
```

## 练习

写一个返回两个同类型参数之和的泛型函数，只实例化成 int，打印 20+22。

::: answer 参考答案
```go run expect="42" title="参考答案"
package main

import "fmt"

func Add(a, b int) int { return a + b }

func main() {
	fmt.Println(Add(20, 22))
}
```
:::

## 常见错误

- 为了练泛型而把所有函数都加上类型参数。具体类型更清楚时不必泛化。
- 在 Yaegi 里调试失败的复杂泛型。先换成具体类型确认逻辑，再拿到本地 Go 里恢复类型参数。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
