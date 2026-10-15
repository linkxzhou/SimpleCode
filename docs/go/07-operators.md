---
language: go
chapter: 7
title: "Go 语言运算符"
level: beginner
minutes: 10
goals:
  - "使用算术、关系和逻辑运算符"
  - "对整数做位运算"
  - "把自增写成独立语句"
sources:
  - gobyexample
updated: "2026-10-15"
---

运算符把值组合成新的值，或做出判断。

### 算术运算符

整数运算里，`/` 是整除，`%` 是余数。

| 运算符 | 含义 | 21 与 10 |
| --- | --- | --- |
| + | 加 | 31 |
| - | 减 | 11 |
| * | 乘 | 210 |
| / | 整除 | 2 |
| % | 余数 | 1 |

```go run expect="2 1" title="整除和余数"
package main

import "fmt"

func main() {
	a, b := 21, 10
	fmt.Println(a/b, a%b)
}
```

输出是 `2 1`。

### 关系与逻辑

关系运算得到 `bool`。`&&` 两边都为真才为真，`||` 有一边为真就为真，`!` 取反。

```go run expect="true false" title="比较"
package main

import "fmt"

func main() {
	a, b := 21, 10
	fmt.Println(a > b, a == b)
}
```

输出是 `true false`。

### 位运算

`&` 按位与，`|` 按位或，`^` 按位异或，`<<` 和 `>>` 移位。下面用 60 和 13。

```go run expect="12 61" title="与和或"
package main

import "fmt"

func main() {
	a, b := 60, 13
	fmt.Println(a&b, a|b)
}
```

输出是 `12 61`。

### 自增是语句

`++` 和 `--` 只能单独成句，不能写进 `a = a++`。

```go run expect="22" title="自增语句"
package main

import "fmt"

func main() {
	a := 21
	a++
	fmt.Println(a)
}
```

输出是 `22`。

```go norun title="不能当作表达式"
a = a++
```
