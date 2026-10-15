---
language: go
chapter: 2
title: "基本类型与格式化"
level: beginner
minutes: 12
goals:
  - "区分 int、float64、string、rune"
  - "用 Printf 控制格式"
  - "按 rune 而不是字节计数"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

`int` 的宽度跟着实现走，这里够用即可。`rune` 是 Unicode 码点，底层是 int32。`len` 对字符串数的是字节，中文一个字往往占 3 个字节。

`fmt.Printf` 的 `%d`、`%s`、`%.1f` 决定怎么印。`\n` 要自己加上，Println 才会自动换行。

```go run expect="int" title="类型"
package main

import "fmt"

func main() {
	fmt.Printf("%T\n", 36)
	fmt.Printf("%.1f\n", 1.25)
}
```

```go run expect="6" title="字节与字"
package main

import "fmt"

func main() {
	word := "你好"
	fmt.Println(len(word))
	n := 0
	for range word {
		n++
	}
	fmt.Println(n)
}
```

```go run expect="A" title="rune"
package main

import "fmt"

func main() {
	fmt.Printf("%c\n", 'A')
}
```

## 练习

打印字符串 `"Go"` 的字节长度。

::: answer 参考答案
```go run expect="2" title="参考答案"
package main

import "fmt"

func main() {
	fmt.Println(len("Go"))
}
```
:::

## 常见错误

- 用 len 判断中文有几个字。len 返回字节数。
- Printf 忘记换行，两行结果粘在一起。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
