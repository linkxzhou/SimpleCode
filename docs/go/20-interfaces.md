---
language: go
chapter: 20
title: "Go 语言接口"
level: intermediate
minutes: 8
goals:
  - "用接口描述一组方法"
  - "让类型隐式满足接口"
  - "把具体值放进接口变量"
sources:
  - gobyexample
updated: "2026-10-15"
---

接口只列出方法，不写字段。一个类型实现了这些方法，就满足该接口，不必声明 `implements`。

### 方法集合

接口里的每个方法都要写出名字、参数和返回值。

```go run expect="喵" title="接口变量"
package main

import "fmt"

type Speaker interface {
	Speak() string
}

type Cat struct{}

func (Cat) Speak() string {
	return "喵"
}

func main() {
	var s Speaker = Cat{}
	fmt.Println(s.Speak())
}
```

输出是 `喵`。

### 隐式实现

只要方法对得上，赋值给接口变量就能通过。少一个方法则会编译失败。

```go run expect="汪" title="另一种实现"
package main

import "fmt"

type Speaker interface {
	Speak() string
}

type Dog struct{}

func (Dog) Speak() string {
	return "汪"
}

func main() {
	say := func(s Speaker) {
		fmt.Println(s.Speak())
	}
	say(Dog{})
}
```

输出是 `汪`。

### 接口里保存具体值

接口值同时带着具体类型和具体数据。方法调用会落到那个具体类型上。

```go run expect="林" title="带着数据"
package main

import "fmt"

type Named interface {
	Name() string
}

type User struct {
	name string
}

func (u User) Name() string {
	return u.name
}

func main() {
	var n Named = User{name: "林"}
	fmt.Println(n.Name())
}
```

输出是 `林`。

### any

`any` 是空接口，任何值都能放进去。放进去之后，具体方法需要再断言才能调用。

```go run expect="5" title="空接口"
package main

import "fmt"

func main() {
	var v any = 5
	fmt.Println(v)
}
```

输出是 `5`。
