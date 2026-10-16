---
language: go
chapter: 24
title: "Go 类型断言"
level: advanced
minutes: 8
goals:
  - "把接口值断言成具体类型"
  - "用两个返回值避免 panic"
  - "用 type switch 按类型分支"
sources:
  - gobyexample
updated: "2026-10-15"
---

放进 `any` 的值要拿回具体类型时，使用类型断言。

### 断言

`v.(string)` 在 `v` 里确实是字符串时得到该字符串。类型不符会 panic。

```go run expect="tea" title="断言成功"
package main

import "fmt"

func main() {
	var v any = "tea"
	fmt.Println(v.(string))
}
```

输出是 `tea`。

### comma-ok

两个返回值时，第二个表示断言是否成功。失败时不会 panic，值是零值。

```go run expect="false" title="断言失败"
package main

import "fmt"

func main() {
	var v any = 3
	_, ok := v.(string)
	fmt.Println(ok)
}
```

输出是 `false`。

### type switch

`switch v.(type)` 按具体类型选择分支。每个 case 写一个类型。

```go run expect="whole" title="按类型分支"
package main

import "fmt"

func main() {
	var v any = 3
	switch v.(type) {
	case string:
		fmt.Println("word")
	case int:
		fmt.Println("whole")
	default:
		fmt.Println("other")
	}
}
```

输出是 `whole`。

### 先判断再使用

单返回值的断言只适合你已经确定类型的时候。不确定时用 comma-ok，或 type switch。

```go run expect="not a string" title="失败时走另一支"
package main

import "fmt"

func main() {
	var v any = 3
	if _, ok := v.(string); ok {
		fmt.Println("word")
	} else {
		fmt.Println("not a string")
	}
}
```

输出是 `not a string`。
