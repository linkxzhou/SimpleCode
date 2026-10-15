---
language: go
chapter: 11
title: "Go 语言变量作用域"
level: beginner
minutes: 8
goals:
  - "区分包级变量和函数内变量"
  - "看出内层声明会挡住外层同名"
  - "知道 if 里声明的名字出了块就消失"
sources:
  - gobyexample
updated: "2026-10-15"
---

名字只在声明它的块里可见。内层可以再声明同名的新变量。

### 包级变量

写在函数外面的变量，本文件的函数都能读。它可以声明而不在某个函数里立刻使用。

```go run expect="克" title="包级单位"
package main

import "fmt"

var unit = "克"

func main() {
	fmt.Println(unit)
}
```

输出是 `克`。

### 函数内的局部变量

`:=` 声明的名字从这一行开始，到函数结束。参数也是局部变量。

```go run expect="林" title="参数"
package main

import "fmt"

func greet(name string) {
	fmt.Println(name)
}

func main() {
	greet("林")
}
```

输出是 `林`。

### 遮蔽

内层块再 `:=` 一个同名变量时，块里看到的是新的那个，外层的值不变。

```go run expect="苏州" title="内层名字"
package main

import "fmt"

func main() {
	city := "杭州"
	{
		city := "苏州"
		fmt.Println(city)
	}
}
```

输出是 `苏州`。花括号结束后，外面的 `city` 仍是杭州。

### 条件里的名字

`if` 分号前声明的变量只活在该条件语句里。

```go run expect="通过" title="条件内的分数"
package main

import "fmt"

func main() {
	if score := 80; score >= 60 {
		fmt.Println("通过")
	}
}
```

输出是 `通过`。
