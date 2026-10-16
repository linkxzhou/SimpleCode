---
language: go
chapter: 1
title: "Go 语言环境安装"
level: beginner
minutes: 8
goals:
  - "分清本页运行和本机安装工具链"
  - "知道按钮不会执行 go env"
  - "确认标准库无需单独下载"
sources:
  - gobyexample
updated: "2026-10-15"
---

本机学习 Go 时要安装工具链并设置 `PATH`。这个页面不走那一步。

### 解释器已经在抽屉里

点 Run 时，当前编辑器里的文本被交给 Yaegi 0.16。不需要 `go install`，也没有 `GOROOT` 可改。

```go run expect="ready" title="不安装也能运行"
package main

import "fmt"

func main() {
	fmt.Println("ready")
}
```

输出是 `ready`。

### 命令行工具在这里不存在

`go version`、`go env` 是工具链的子命令，不是 Go 源码。写进 `.go` 文件不会变成那些命令。

```go norun title="这不是能执行的源码"
go version
go env GOPATH
```

要在自己的电脑上编译，再安装官方工具链。课程按钮只解释 `package main`。

### 标准库随解释器提供

`fmt`、`strings`、`errors` 这一类包可以直接导入，不必再下载模块。

```go run expect="2" title="直接使用标准库"
package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println(strings.Count("aa", "a"))
}
```

输出是 `2`。
