---
language: go
chapter: 3
title: "Go 语言基础语法"
level: beginner
minutes: 8
goals:
  - "使用行注释"
  - "按 Go 的规则给名字"
  - "知道换行会结束一条简单语句"
sources:
  - gobyexample
updated: "2026-10-15"
---

语法决定名字、注释和语句怎样分开。

### 注释

`//` 注释到行尾。`/* */` 可以跨行。注释不产生输出。

```go run expect="可见" title="注释被跳过"
package main

import "fmt"

func main() {
	// 这一行不执行
	fmt.Println("可见")
}
```

输出是 `可见`。

### 标识符

名字由字母、数字和下划线组成，并且不能以数字开头。习惯用驼峰，而不是下划线把单词隔开。

```go run expect="8" title="驼峰名字"
package main

import "fmt"

func main() {
	itemCount := 8
	fmt.Println(itemCount)
}
```

输出是 `8`。

### 语句的结尾

编译器在行尾自动补上分号。因此 `{` 要留在语句同一行，不能单独换到下一行。

```go run expect="同一行" title="左花括号的位置"
package main

import "fmt"

func main() {
	fmt.Println("同一行")
}
```

输出是 `同一行`。

### 大小写决定能否对外

包外只能看见大写开头的名字。本教程只有一个文件，但库代码仍遵守这条规则。

```go run expect="内部" title="小写名字留在包内"
package main

import "fmt"

func hidden() string {
	return "内部"
}

func main() {
	fmt.Println(hidden())
}
```

输出是 `内部`。
