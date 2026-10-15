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

```go run expect="正数" title="if else"
package main

import "fmt"

func main() {
	n := 4
	if n > 0 {
		fmt.Println("正数")
	} else {
		fmt.Println("非正")
	}
}
```

输出是 `正数`。

### 带初始化的 if

分号前可以声明一个只在该 `if` 里可见的名字。

```go run expect="偏高" title="初始化语句"
package main

import "fmt"

func main() {
	if temp := 36; temp > 35 {
		fmt.Println("偏高")
	}
}
```

输出是 `偏高`。`temp` 出了这个 `if` 就不能再使用。

### switch

`switch` 从上到下匹配，命中后不会掉进下一个 `case`。不需要写 `break`。

```go run expect="三" title="按值分支"
package main

import "fmt"

func main() {
	day := 3
	switch day {
	case 1:
		fmt.Println("一")
	case 3:
		fmt.Println("三")
	default:
		fmt.Println("其他")
	}
}
```

输出是 `三`。

### 没有表达式的 switch

省略被比较的值时，每个 `case` 自己写一个条件，相当于一串 `if` / `else if`。

```go run expect="中等" title="条件 switch"
package main

import "fmt"

func main() {
	score := 70
	switch {
	case score >= 90:
		fmt.Println("高")
	case score >= 60:
		fmt.Println("中等")
	default:
		fmt.Println("低")
	}
}
```

输出是 `中等`。
