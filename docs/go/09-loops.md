---
language: go
chapter: 9
title: "Go 语言循环语句"
level: beginner
minutes: 8
goals:
  - "用三段式 for 重复固定次数"
  - "用条件 for 代替 while"
  - "用 break 和 continue 改变一轮"
sources:
  - gobyexample
updated: "2026-10-15"
---

Go 只有 `for` 一种循环。三种写法覆盖计数、条件和无限循环。

### 三段式

初始化、条件和后置语句用分号隔开。下面先累加，再打印。

```go run expect="6" title="从 1 加到 3"
package main

import "fmt"

func main() {
	sum := 0
	for i := 1; i <= 3; i++ {
		sum += i
	}

	fmt.Println(sum)
}
```

输出是 `6`。

### 只保留条件

拿掉初始化和后置，就相当于其它语言的 `while`。

```go run expect="0" title="减到零"
package main

import "fmt"

func main() {
	left := 2
	for left > 0 {
		left--
	}
	fmt.Println(left)
}
```

输出是 `0`。

### break 与 continue

`break` 离开整层循环。`continue` 跳过本轮剩下的语句。

```go run expect="4" title="跳过偶数"
package main

import "fmt"

func main() {
	sum := 0
	for i := 1; i <= 4; i++ {
		if i%2 == 0 {
			continue
		}
		sum += i
	}
	fmt.Println(sum)
}
```

输出是 `4`，来自 1 和 3。

### 用 break 结束无限循环

`for { }` 没有条件。必须在块里 `break`，否则程序不会返回。

```go run expect="3" title="数到 3 就停"
package main

import "fmt"

func main() {
	n := 0
	for {
		n++
		if n == 3 {
			break
		}
	}
	fmt.Println(n)
}
```

输出是 `3`。
