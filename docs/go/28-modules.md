---
language: go
chapter: 28
title: "Go Modules"
level: advanced
minutes: 8
goals:
  - "知道本机工程用 go.mod 记录依赖"
  - "明白本页只有当前这一个文件"
  - "只导入解释器自带的标准库"
sources:
  - gobyexample
updated: "2026-10-15"
---

Go 1.16 之后，一个目录通常是一个模块，依赖写在 `go.mod` 里。本页的 Run 不读取模块文件。

### 本机上的模块

`go mod init` 会生成 `go.mod`。第三方包用模块路径导入，再由 `go mod tidy` 写入依赖。这些命令不是 Go 源码。

```go norun title="工具链命令"
go mod init example.com/shop
go get rsc.io/quote
```

### 这里只有一个文件

解释器执行编辑器里的那一段文本。没有第二个 `.go`，也没有 `go.mod`。

```go run expect="单文件" title="当前文件"
package main

import "fmt"

func main() {
	fmt.Println("单文件")
}
```

输出是 `单文件`。

### 标准库不需要模块路径

`fmt` 这类包由解释器提供。导入它们不需要在 `go.mod` 里声明。

```go run expect="1" title="标准库"
package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println(strings.Count("a", "a"))
}
```

输出是 `1`。

### 自己的包路径找不到

`import "shop/order"` 会失败，因为没有那个目录。辅助代码写在 `main` 旁边。

```go norun title="没有这个包"
package main

import "shop/order"

func main() {
	order.Print()
}
```
