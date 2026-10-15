---
language: go
chapter: 13
title: "Go 语言指针"
level: intermediate
minutes: 8
goals:
  - "用 & 取得变量地址"
  - "用 * 读取并修改所指的值"
  - "避免对空指针解引用"
sources:
  - gobyexample
updated: "2026-10-15"
---

指针保存一个变量的地址。通过指针可以改到原来的那块值。

### 取地址

`&` 放在变量前面，得到指向它的指针。类型写作 `*T`。

```go run expect="9" title="指针指向原变量"
package main

import "fmt"

func main() {
	n := 9
	p := &n
	fmt.Println(*p)
}
```

输出是 `9`。

### 通过指针修改

对指针使用 `*` 得到它指向的变量，赋值会写回那个变量。

```go run expect="8" title="解引用赋值"
package main

import "fmt"

func main() {
	n := 3
	p := &n
	*p = 8
	fmt.Println(n)
}
```

输出是 `8`。`n` 自己被改了。

### 函数参数

指针参数让函数改到调用方的变量。传值则只改副本。

```go run expect="11" title="函数里加一"
package main

import "fmt"

func inc(p *int) {
	*p = *p + 1
}

func main() {
	n := 10
	inc(&n)
	fmt.Println(n)
}
```

输出是 `11`。

### 空指针

声明了但没有指向任何变量的指针是 `nil`。对它解引用会 panic。

```go run expect="空指针" title="先判断再使用"
package main

import "fmt"

func main() {
	defer func() {
		if recover() != nil {
			fmt.Println("空指针")
		}
	}()
	var p *int
	fmt.Println(*p)
}
```

输出是 `空指针`。使用前应判断 `p != nil`。
