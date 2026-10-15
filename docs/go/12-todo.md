---
language: go
chapter: 12
title: "小项目：命令行待办"
level: advanced
minutes: 16
goals:
  - "用结构体保存一条待办"
  - "从标准输入接收命令"
  - "把清单只放在内存里"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

待办事项用切片保存。命令 `add 文字` 追加一条，`list` 打印全部。程序读到 EOF 就结束，清单不写入磁盘。

示例一次喂入两行命令。

```go run stdin="add 买笔\nlist\n" expect="买笔" title="待办"
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type item struct{ title string }

func main() {
	var items []item
	in := bufio.NewScanner(os.Stdin)
	for in.Scan() {
		fields := strings.SplitN(in.Text(), " ", 2)
		switch fields[0] {
		case "add":
			items = append(items, item{title: fields[1]})
		case "list":
			fmt.Println(len(items))
		}
	}
	fmt.Println(items[0].title)
}
```

```go run expect="2" title="完成数"
package main

import "fmt"

func doneCount(flags []bool) int {
	n := 0
	for _, ok := range flags {
		if ok {
			n++
		}
	}
	return n
}

func main() {
	fmt.Println(doneCount([]bool{true, false, true}))
}
```

::: note
想跨次运行保存清单，需要本环境之外的文件系统。刷新页面后内存清单会消失。
:::

## 练习

只执行 `add 书`，打印条数 1。可以不读输入，直接 append。

::: answer 参考答案
```go run expect="1" title="参考答案"
package main

import "fmt"

func main() {
	items := []string{}
	items = append(items, "书")
	fmt.Println(len(items))
}
```
:::

## 常见错误

- SplitN 的结果只有命令、没有正文时访问 fields[1]。先检查长度。
- 把清单存进全局变量就以为下次运行还在。进程一结束就没了。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
