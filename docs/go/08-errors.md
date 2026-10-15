---
language: go
chapter: 8
title: "错误处理"
level: intermediate
minutes: 12
goals:
  - "返回 error 而不是忽略"
  - "用 %w 包装错误"
  - "用 errors.Is 判断原因"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

Go 的惯用法是把错误当成返回值。`fmt.Errorf` 的 `%w` 保留原因，`errors.Is` 能顺着包装链找回去。

`panic` 留给真正无法继续的情况。`recover` 只能在 defer 里接住 panic。

```go run expect="empty" title="errors.Is"
package main

import (
	"errors"
	"fmt"
)

var errEmpty = errors.New("empty")

func parse(s string) error {
	if s == "" {
		return fmt.Errorf("parse: %w", errEmpty)
	}
	return nil
}

func main() {
	if errors.Is(parse(""), errEmpty) {
		fmt.Println("empty")
	}
}
```

```go run expect="42" title="Atoi"
package main

import (
	"fmt"
	"strconv"
)

func main() {
	n, err := strconv.Atoi("41")
	if err != nil {
		fmt.Println("bad")
		return
	}
	fmt.Println(n + 1)
}
```

```go run expect="recovered" title="recover"
package main

import "fmt"

func main() {
	defer func() {
		if recover() != nil {
			fmt.Println("recovered")
		}
	}()
	panic("boom")
}
```

## 练习

Atoi 解析 `"no"`，出错时打印「不是整数」。

::: answer 参考答案
```go run expect="不是整数" title="参考答案"
package main

import (
	"fmt"
	"strconv"
)

func main() {
	if _, err := strconv.Atoi("no"); err != nil {
		fmt.Println("不是整数")
	}
}
```
:::

## 常见错误

- 用 _ 丢掉 error。失败会变成后面的零值，很难查。
- panic 当普通分支用。可预期的输入错误应该返回 error。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
