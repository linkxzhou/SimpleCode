---
language: go
chapter: 0
title: "概览：这里的 Go"
minutes: 8
goals:
  - "知道本环境用 Yaegi 解释执行"
  - "写出完整的 package main"
  - "不使用 go get"
sources:
  - gobyexample
  - go-tour
  - little-go-book
updated: "2026-10-15"
---

这里的 Go 不是 `go build`，而是 Yaegi 0.16.1 在浏览器里解释执行。每个示例都必须是完整的 `package main`，并且只使用解释器自带的标准库。

没有 `go get`、cgo 和网络。个别反射、泛型和 unsafe 的行为与官方编译器不同，复杂写法会标成只读。

```go run expect="你好" title="问候"
package main

import "fmt"

func main() {
	fmt.Println("你好")
}
```

```go norun title="不做的事"
package main

// 只读：不要在示例里访问网络。
// import "net/http"
```

```go run expect="42" title="运算"
package main

import "fmt"

func main() {
	fmt.Println(6 * 7)
}
```

## 练习

打印你自己的一行问候。

::: answer 参考答案
```go run expect="你好，杭州" title="参考答案"
package main

import "fmt"

func main() {
	fmt.Println("你好，杭州")
}
```
:::

## 常见错误

- 漏写 package main。Yaegi 需要它作为入口。
- 留下没有使用的 import。解释器会报错。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
