---
language: go
chapter: 25
title: "Go 继承"
level: advanced
minutes: 8
goals:
  - "说明 Go 没有类继承"
  - "用嵌入复用字段和方法"
  - "让外层方法覆盖内层同名方法"
sources:
  - gobyexample
updated: "2026-10-15"
---

Go 没有 `extends`。复用靠把一个类型嵌进另一个类型，这是组合，不是子类。

### 没有类继承

不能声明一个结构体去继承另一个结构体的实现。想复用，就把内层类型当作字段嵌进去。

```go norun title="没有这种语法"
type Cat extends Animal {
}
```

### 嵌入

嵌入时只写类型名，不写字段名。外层可以直接用内层的字段和方法。

```go run expect="7" title="提升的方法"
package main

import "fmt"

type Point struct {
	X, Y int
}

func (p Point) Sum() int {
	return p.X + p.Y
}

type Pixel struct {
	Point
}

func main() {
	px := Pixel{Point: Point{X: 2, Y: 5}}
	fmt.Println(px.Sum())
}
```

输出是 `7`。

### 字段也被提升

嵌入之后，内层字段可以写在外层值上，不必每次都写出内层名字。

```go run expect="2" title="直接读 X"
package main

import "fmt"

type Point struct {
	X int
}

type Pixel struct {
	Point
}

func main() {
	px := Pixel{Point: Point{X: 2}}
	fmt.Println(px.X)
}
```

输出是 `2`。

### 外层同名方法优先

外层再定义同名方法时，调用外层值会走到外层，内层方法仍可通过内层类型调用。

```go run expect="2" title="外层说了算"
package main

import "fmt"

type Point struct {
	X, Y int
}

func (p Point) Sum() int {
	return p.X + p.Y
}

type Pixel struct {
	Point
}

func (px Pixel) Sum() int {
	return px.X
}

func main() {
	px := Pixel{Point: Point{X: 2, Y: 5}}
	fmt.Println(px.Sum())
}
```

输出是 `2`，不是 7。
