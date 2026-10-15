---
language: go
chapter: 11
title: "标准库精选"
level: advanced
minutes: 12
goals:
  - "用 strings 和 sort"
  - "用 time.Date 而不是 Sleep"
  - "用 encoding/json 编解码"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

`strings`、`sort`、`strconv` 和 `encoding/json` 覆盖了大部分小工具。`time.Date` 构造一个确定的时刻，不需要让程序真的睡下去。

JSON 的字段名由结构体标签决定。标签要用反引号。

```go run expect="GO" title="strings"
package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println(strings.ToUpper("go"))
	fmt.Println(strings.Count("banana", "a"))
}
```

```go run expect="1 3" title="排序"
package main

import (
	"fmt"
	"sort"
)

func main() {
	nums := []int{3, 1, 2}
	sort.Ints(nums)
	fmt.Println(nums[0], nums[2])
}
```

```go run expect="2026" title="时间和 JSON"
package main

import (
	"encoding/json"
	"fmt"
	"time"
)

type Item struct {
	Name string `json:"name"`
}

func main() {
	t := time.Date(2026, 10, 15, 0, 0, 0, 0, time.UTC)
	b, err := json.Marshal(Item{Name: "笔"})
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(t.Year())
	fmt.Println(string(b))
}
```

## 练习

把 JSON `{"name":"Ada"}` 解到结构体并打印 Name。

::: answer 参考答案
```go run expect="Ada" title="参考答案"
package main

import (
	"encoding/json"
	"fmt"
)

type Item struct {
	Name string `json:"name"`
}

func main() {
	var item Item
	if err := json.Unmarshal([]byte(`{"name":"Ada"}`), &item); err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(item.Name)
}
```
:::

## 常见错误

- 用 time.Sleep 制造先后顺序。这里不保证真实等待，用 channel 交接更明确。
- JSON 字段是小写开头又没有标签。编码时不会导出未导出字段。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
