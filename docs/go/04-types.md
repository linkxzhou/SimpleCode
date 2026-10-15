---
language: go
chapter: 4
title: "Go 语言数据类型"
level: beginner
minutes: 8
goals:
  - "区分整数、浮点、布尔和字符串"
  - "记住各类型的零值"
  - "知道 len 对字符串数的是字节"
sources:
  - gobyexample
updated: "2026-10-15"
---

每个值都有类型。类型决定能做哪些运算，以及未赋值时的零值。

### 常用类型

| 类型 | 含义 | 零值 |
| --- | --- | --- |
| int | 整数 | 0 |
| float64 | 小数 | 0 |
| bool | 真或假 | false |
| string | 文本 | "" |

### 整数和浮点

整数相除会丢掉小数。需要小数时使用 `float64`。

```go run expect="3" title="整数除法"
package main

import "fmt"

func main() {
	fmt.Println(20 / 6)
}
```

输出是 `3`。

```go run expect="3.5" title="浮点除法"
package main

import "fmt"

func main() {
	fmt.Println(7.0 / 2.0)
}
```

输出是 `3.5`。

### 布尔

`bool` 只有 `true` 和 `false`。它不是整数，不能写成 `if 1`。

```go run expect="true" title="布尔值"
package main

import "fmt"

func main() {
	open := true
	fmt.Println(open)
}
```

输出是 `true`。

### 字符串的长度

`len` 返回字节数。一个汉字在 UTF-8 里通常是 3 个字节。

```go run expect="6" title="字节数"
package main

import "fmt"

func main() {
	fmt.Println(len("你好"))
}
```

输出是 `6`。
