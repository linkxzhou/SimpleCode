---
language: go
chapter: 0
title: "Go 语言教程"
level: beginner
minutes: 8
goals:
  - "知道本教程在浏览器里用解释器执行单个文件"
  - "写出带 package main 的第一份程序"
  - "用 fmt.Println 把结果送到终端"
sources:
  - gobyexample
updated: "2026-10-15"
---

Go 是一门静态类型的编译型语言。这个抽屉不调用 `go build`，而是用 Yaegi 解释当前这一份源码。

### 程序从 main 进入

源文件以 `package main` 开头。解释器只把名为 `main` 的函数当作入口。

```go run expect="你好" title="第一份程序"
package main

import "fmt"

func main() {
	fmt.Println("你好")
}
```

输出是 `你好`。`Println` 会在末尾加上换行。

### 结果必须打印出来

算式本身不会出现在终端里。要把数字交给 `fmt`，否则页面上看起来像没运行。

```go run expect="42" title="打印计算结果"
package main

import "fmt"

func main() {
	fmt.Println(6 * 7)
}
```

输出是 `42`。

### 一个文件就是全部

不能再 `import` 你自己的另一个包，解释器没有那份源码。标准库可以导入。辅助函数写在同一个文件里。

```go run expect="3" title="同文件里的函数"
package main

import "fmt"

func add(a, b int) int {
	return a + b
}

func main() {
	fmt.Println(add(1, 2))
}
```

输出是 `3`。
