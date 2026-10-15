---
language: go
chapter: 7
title: "接口"
level: intermediate
minutes: 12
goals:
  - "用隐式实现满足接口"
  - "做类型断言"
  - "实现 Stringer"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

接口只描述方法。只要类型拥有这些方法，就自动满足接口，不用写 implements。

类型断言 `v.(T)` 有两个返回值时不会 panic。`fmt` 打印时如果发现 `String() string`，会用它。

```go run expect="12" title="形状"
package main

import "fmt"

type Shape interface{ Area() int }

type Rect struct{ W, H int }

func (r Rect) Area() int { return r.W * r.H }

func main() {
	var s Shape = Rect{3, 4}
	fmt.Println(s.Area())
}
```

```go run expect="user:Ada" title="Stringer"
package main

import "fmt"

type User struct{ Name string }

func (u User) String() string { return "user:" + u.Name }

func main() {
	fmt.Println(User{Name: "Ada"})
}
```

```go run expect="43" title="类型断言"
package main

import "fmt"

func main() {
	var v any = 42
	if n, ok := v.(int); ok {
		fmt.Println(n + 1)
	}
}
```

## 练习

定义一个只有 `Error() string` 的类型，并打印它。

::: answer 参考答案
```go run expect="oops" title="参考答案"
package main

import "fmt"

type Oops struct{}

func (Oops) Error() string { return "oops" }

func main() {
	var err error = Oops{}
	fmt.Println(err.Error())
}
```
:::

## 常见错误

- 类型断言不接 ok，类型不对时 panic。
- 接口里放大方法集。实现者要全部满足，小接口更好组合。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
