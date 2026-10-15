---
language: go
chapter: 21
title: "Go 语言泛型"
level: advanced
minutes: 8
goals:
  - "给函数加上类型参数"
  - "用约束限制可用的类型"
  - "让调用处推断类型参数"
sources:
  - gobyexample
updated: "2026-10-15"
---

类型参数让同一份函数体服务多种类型。这个解释器可以运行简单的类型参数。

### 类型参数

方括号里的 `T` 是类型参数。`any` 表示调用时可以是任意类型。

```go run expect="水" title="取第二个"
package main

import "fmt"

func second[T any](a, b T) T {
	return b
}

func main() {
	fmt.Println(second("茶", "水"))
}
```

输出是 `水`。

### 约束

`~int` 表示底层类型是 `int` 的类型，这样函数里才能比较大小。

```go run expect="2" title="较小的整数"
package main

import "fmt"

func smaller[T ~int](a, b T) T {
	if a < b {
		return a
	}
	return b
}

func main() {
	fmt.Println(smaller(4, 2))
}
```

输出是 `2`。

### 推断

参数已经能看出 `T` 时，调用处不必再写 `[int]`。

```go run expect="4" title="推断为 int"
package main

import "fmt"

func second[T any](a, b T) T {
	return b
}

func main() {
	fmt.Println(second(3, 4))
}
```

输出是 `4`。

### 两种类型不能混用

同一次调用里，`T` 只有一个。字符串和整数不能一起传给 `second`。

```go norun title="类型参数不一致"
second("茶", 1)
```

注意：更复杂的约束和类型集合以本机 `go build` 为准。这里只演示解释器能执行的形式。
