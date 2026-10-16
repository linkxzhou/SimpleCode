---
language: go
chapter: 25
title: "Go Inheritance"
level: advanced
minutes: 8
goals:
  - "State that Go has no class inheritance"
  - "Reuse fields and methods by embedding"
  - "Let an outer method replace an inner method of the same name"
sources:
  - gobyexample
updated: "2026-10-16"
---

Go has no `extends` keyword. You reuse behavior by embedding one type in another. That arrangement is composition.

### No class inheritance

A structure cannot inherit another structure's implementation. Embed the inner type when you want its fields and methods.

```go norun title="No such syntax"
type Cat extends Animal {
}
```

### Embedding

An embedded field is written as a bare type name. The outer value can call the inner methods without an extra selector.

```go run expect="7" title="A promoted method"
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

The promoted sum is `7`.

### Promoted fields

After embedding, an inner field can be read on the outer value. Repeating the inner type name at every use is unnecessary.

```go run expect="2" title="Read X directly"
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

The promoted coordinate is `2`.

### An outer method wins

An outer method of the same name is the one invoked on the outer value. The inner method remains reachable through the inner type.

```go run expect="2" title="The outer method decides"
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

The outer sum prints `2`. The inner sum would have been 7.
