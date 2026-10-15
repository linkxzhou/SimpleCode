---
language: go
chapter: 16
title: "Go 语言范围(Range)"
level: intermediate
minutes: 8
goals:
  - "用 range 遍历切片"
  - "丢掉不需要的下标"
  - "对字符串按 rune 遍历"
sources:
  - gobyexample
updated: "2026-10-15"
---

`range` 依次给出下标和元素。循环变量每一轮都会被重新赋值。

### 遍历切片

第一个变量是下标，第二个是元素的副本。

```go run expect="1:茶" title="下标和元素"
package main

import "fmt"

func main() {
	items := []string{"水", "茶"}
	for i, name := range items {
		if i == 1 {
			fmt.Printf("%d:%s\n", i, name)
		}
	}
}
```

输出是 `1:茶`。

### 只要元素

下标写成 `_`。没有用到的名字不能留着，否则编译失败。

```go run expect="2" title="元素个数"
package main

import "fmt"

func main() {
	n := 0
	for _, name := range []string{"茶", "水"} {
		if name != "" {
			n++
		}
	}
	fmt.Println(n)
}
```

输出是 `2`。

### 遍历字符串

对字符串 `range` 时，下标是字节位置，值是 `rune`，不是字节。

```go run expect="2" title="两个汉字"
package main

import "fmt"

func main() {
	n := 0
	for range "你好" {
		n++
	}
	fmt.Println(n)
}
```

输出是 `2`。`len("你好")` 仍是 6。

### 遍历 map 不保证次序

`range` 走 map 时，每一轮的键次序可能不同。要核对某个键，直接用键读取，不要依赖打印顺序。

```go run expect="18" title="按键读取"
package main

import "fmt"

func main() {
	price := map[string]int{"茶": 18}
	for _, v := range price {
		fmt.Println(v)
	}
}
```

输出是 `18`。这里只有一个键，所以次序不影响结果。
