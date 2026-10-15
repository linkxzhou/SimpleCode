---
language: go
chapter: 2
title: "Go 语言结构"
level: beginner
minutes: 8
goals:
  - "写出包声明、导入和 main"
  - "让导入的名字在代码里出现"
  - "把辅助函数留在同一个文件"
sources:
  - gobyexample
updated: "2026-10-15"
---

一份可执行程序由包声明、导入和 `main` 函数组成。

### 包声明

`package` 必须放在非注释代码的最前。程序的包名是 `main`。

```go run expect="main 包" title="包声明"
package main

import "fmt"

func main() {
	fmt.Println("main 包")
}
```

输出是 `main 包`。

### 导入

`import` 引入其它包的导出名。圆括号可以一次列出多个包，每个包一行。

```go run expect="2" title="导入两个包"
package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println(len(strings.TrimSpace("  ab ")))
}
```

输出是 `2`。`TrimSpace` 去掉两端空白后剩下 `ab`。

### 入口函数

`func main()` 没有参数，也没有返回值。解释器从这里开始执行。

```go run expect="进入" title="入口"
package main

import "fmt"

func main() {
	fmt.Println("进入")
}
```

输出是 `进入`。

### 导入了就要用到

正式的编译器拒绝未使用的导入。课程里的每个导入都出现在后面的代码中，避免把这份文件拿到 `go build` 上才失败。

```go norun title="未使用的导入"
package main

import "strings"

func main() {}
```

注意：删掉没有调用的包名，或真正调用它。
