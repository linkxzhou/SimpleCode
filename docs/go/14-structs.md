---
language: go
chapter: 14
title: "Go 语言结构体"
level: intermediate
minutes: 8
goals:
  - "用 struct 把字段放在一起"
  - "用字面量填写字段"
  - "给结构体定义方法"
sources:
  - gobyexample
updated: "2026-10-15"
---

结构体把若干字段收成一个类型。字段名大写时，其它包才能读写。

### 定义

`type` 给结构体起名字。每个字段一行，先名字后类型。

```go run expect="tea" title="读取字段"
package main

import "fmt"

type Item struct {
	Name  string
	Price int
}

func main() {
	var it Item
	it.Name = "tea"
	fmt.Println(it.Name)
}
```

输出是 `tea`。未设置的 `Price` 是 0。

### 字面量

字段名加冒号，次序可以不跟声明一致。省略的字段仍是零值。

```go run expect="18" title="指定字段"
package main

import "fmt"

type Item struct {
	Name  string
	Price int
}

func main() {
	it := Item{Name: "tea", Price: 18}
	fmt.Println(it.Price)
}
```

输出是 `18`。

### 值接收者

方法写在函数名前面的接收者上。值接收者拿到的是副本。

```go run expect="tea 18" title="方法"
package main

import "fmt"

type Item struct {
	Name  string
	Price int
}

func (it Item) Label() string {
	return it.Name
}

func main() {
	it := Item{Name: "tea", Price: 18}
	fmt.Println(it.Label(), it.Price)
}
```

输出是 `tea 18`。

### 指针接收者

要在方法里改字段，接收者用指针。调用时写变量即可，不必手写 `&`。

```go run expect="20" title="改价格"
package main

import "fmt"

type Item struct {
	Price int
}

func (it *Item) Raise(n int) {
	it.Price += n
}

func main() {
	it := Item{Price: 18}
	it.Raise(2)
	fmt.Println(it.Price)
}
```

输出是 `20`。
