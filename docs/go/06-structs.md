---
language: go
chapter: 6
title: "结构体与方法"
level: intermediate
minutes: 12
goals:
  - "定义 struct"
  - "区分值接收者和指针接收者"
  - "用嵌入复用字段"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

结构体是一组字段。方法写在类型后面：值接收者拿到副本，指针接收者可以改原对象。

嵌入不是继承。内层类型的字段和方法会被提升，外面可以直接调用。

```go run expect="Ada 125" title="账户"
package main

import "fmt"

type Account struct {
	Owner   string
	Balance int
}

func (a *Account) Deposit(n int) {
	a.Balance += n
}

func main() {
	acc := Account{Owner: "Ada", Balance: 100}
	acc.Deposit(25)
	fmt.Println(acc.Owner, acc.Balance)
}
```

```go run expect="12" title="矩形"
package main

import "fmt"

type Rect struct{ W, H int }

func (r Rect) Area() int { return r.W * r.H }

func main() {
	fmt.Println(Rect{W: 3, H: 4}.Area())
}
```

```go run expect="3 原点旁" title="嵌入"
package main

import "fmt"

type Point struct{ X, Y int }

type Named struct {
	Point
	Name string
}

func main() {
	n := Named{Point: Point{1, 2}, Name: "原点旁"}
	fmt.Println(n.X+n.Y, n.Name)
}
```

## 练习

给 Point 加一个 Dist 方法，返回 X 和 Y 的和的绝对值，打印 (1, -4)。

::: answer 参考答案
```go run expect="3" title="参考答案"
package main

import "fmt"

type Point struct{ X, Y int }

func (p Point) Manhattan() int {
	s := p.X + p.Y
	if s < 0 {
		return -s
	}
	return s
}

func main() {
	fmt.Println(Point{1, -4}.Manhattan())
}
```
:::

## 常见错误

- 值接收者里修改字段，调用后原值不变。需要修改就用指针接收者。
- 嵌入的字段和外部字段同名，提升会被挡住。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
