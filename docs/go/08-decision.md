---
language: go
chapter: 8
title: "Go 语言条件语句"
level: beginner
minutes: 8
goals:
  - "用 if 选择分支"
  - "在 if 里写一条初始化语句"
  - "用 switch 列出离散取值"
sources:
  - gobyexample
updated: "2026-10-15"
---

条件语句根据 `bool` 决定走哪一段。条件外面不要加多余的括号。

### if

条件为真时执行紧跟的块。`else` 接在 `}` 同一行。

```go run expect="plus" title="if else"
package main

import "fmt"

func main() {
	n := 4
	if n > 0 {
		fmt.Println("plus")
	} else {
		fmt.Println("badnum")
	}
}
```

输出是 `plus`。

### 带初始化的 if

分号前可以声明一个只在该 `if` 里可见的名字。

```go run expect="toohigh" title="初始化语句"
package main

import "fmt"

func main() {
	if temp := 36; temp > 35 {
		fmt.Println("toohigh")
	}
}
```

输出是 `toohigh`。`temp` 出了这个 `if` 就不能再使用。

### switch

`switch` 从上到下匹配，命中后不会掉进下一个 `case`。不需要写 `break`。

```go run expect="three" title="按值分支"
package main

import "fmt"

func main() {
	day := 3
	switch day {
	case 1:
		fmt.Println("one")
	case 3:
		fmt.Println("three")
	default:
		fmt.Println("other")
	}
}
```

输出是 `three`。

### 没有表达式的 switch

省略被比较的值时，每个 `case` 自己写一个条件，相当于一串 `if` / `else if`。

```go run expect="medium" title="条件 switch"
package main

import "fmt"

func main() {
	score := 70
	switch {
	case score >= 90:
		fmt.Println("high")
	case score >= 60:
		fmt.Println("medium")
	default:
		fmt.Println("low")
	}
}
```

输出是 `medium`。
