---
language: go
chapter: 17
title: "Go 语言 Map(集合)"
level: intermediate
minutes: 8
goals:
  - "用 make 创建 map"
  - "用 comma-ok 判断键是否存在"
  - "知道 nil map 不能写入"
sources:
  - gobyexample
updated: "2026-10-15"
---

map 按键保存值。键必须可以用 `==` 比较，字符串和整数都可以。

### 创建

`make` 得到一张可以写入的空表。字面量可以同时放入几对键值。

```go run expect="18" title="字面量"
package main

import "fmt"

func main() {
	price := map[string]int{"tea": 18}
	fmt.Println(price["tea"])
}
```

输出是 `18`。

### 判断键是否存在

读取返回两个结果：值和是否存在。不存在时值是零值，第二个结果是 `false`。

```go run expect="false" title="没有这个键"
package main

import "fmt"

func main() {
	price := map[string]int{}
	_, ok := price["water"]
	fmt.Println(ok)
}
```

输出是 `false`。

### 删除

`delete` 按键删掉一项。键本来就不存在时，调用也是安全的。

```go run expect="false" title="删除之后"
package main

import "fmt"

func main() {
	price := map[string]int{"tea": 18}
	delete(price, "tea")
	_, ok := price["tea"]
	fmt.Println(ok)
}
```

输出是 `false`。

### nil map 不能写

只声明、不 `make` 的 map 是 `nil`。读取得到零值，写入会 panic。

```go run expect="nowrite" title="先创建再写入"
package main

import "fmt"

func main() {
	defer func() {
		if recover() != nil {
			fmt.Println("nowrite")
		}
	}()
	var price map[string]int
	price["tea"] = 18
}
```

输出是 `nowrite`。
