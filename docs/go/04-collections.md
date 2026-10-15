---
language: go
chapter: 4
title: "数组、切片与 map"
level: beginner
minutes: 12
goals:
  - "区分数组和切片"
  - "用 append 生长切片"
  - "用 map 统计词频"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

数组长度是类型的一部分。切片是数组的窗口，`append` 可能换一块底层存储。map 的键必须能比较。

读一行输入用 `bufio.Scanner`。示例把样例输入交给标准输入。

```go run stdin="to be or not to be\n" expect="2" title="词频"
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	in := bufio.NewScanner(os.Stdin)
	in.Scan()
	counts := map[string]int{}
	for _, word := range strings.Fields(in.Text()) {
		counts[word]++
	}
	fmt.Println(counts["to"])
}
```

```go run expect="[1 2 3]" title="去重保序"
package main

import "fmt"

func main() {
	nums := []int{1, 2, 2, 3}
	seen := map[int]bool{}
	var out []int
	for _, n := range nums {
		if !seen[n] {
			seen[n] = true
			out = append(out, n)
		}
	}
	fmt.Println(out)
}
```

```go run expect="2 3" title="切片窗口"
package main

import "fmt"

func main() {
	a := [3]int{7, 8, 9}
	s := a[:2]
	fmt.Println(len(s), cap(a))
}
```

## 练习

append 两次，打印切片长度。

::: answer 参考答案
```go run expect="2" title="参考答案"
package main

import "fmt"

func main() {
	var s []int
	s = append(s, 1, 2)
	fmt.Println(len(s))
}
```
:::

## 常见错误

- 把切片当成永远指向原数组。append 超出容量时会换新数组。
- range map 的顺序当成稳定的。要稳定输出就收集键再排序。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
