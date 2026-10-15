---
language: go
chapter: 19
title: "Go 语言类型转换"
level: intermediate
minutes: 8
goals:
  - "在数值类型之间显式转换"
  - "区分 rune 转字符串和数字转字符串"
  - "用 strconv 解析十进制文本"
sources:
  - gobyexample
updated: "2026-10-15"
---

Go 不做隐式数值转换。想换类型，就要写出目标类型。

### 数值转换

先把小数放进变量，再转成 `int`。小数部分被丢掉，不是四舍五入。

```go run expect="3" title="丢掉小数"
package main

import "fmt"

func main() {
	f := 3.9
	fmt.Println(int(f))
}
```

输出是 `3`。

### rune 和字符串

`string(rune)` 得到该码点对应的字符，不是数字的十进制写法。

```go run expect="A" title="码点 65"
package main

import "fmt"

func main() {
	fmt.Println(string(rune(65)))
}
```

输出是 `A`。

### 整数和十进制文本

`strconv.Itoa` 把整数变成字符串。`Atoi` 反过来，并返回一个 `error`。

```go run expect="7 true" title="Itoa 与 Atoi"
package main

import (
	"fmt"
	"strconv"
)

func main() {
	text := strconv.Itoa(7)
	n, err := strconv.Atoi(text)
	fmt.Println(n, err == nil)
}
```

输出是 `7 true`。

### 解析失败

文本不是整数时，`Atoi` 返回错误，数值结果不要拿去运算。

```go run expect="true" title="非数字"
package main

import (
	"fmt"
	"strconv"
)

func main() {
	_, err := strconv.Atoi("no")
	fmt.Println(err != nil)
}
```

输出是 `true`。
