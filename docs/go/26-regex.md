---
language: go
chapter: 26
title: "Go 语言正则表达式"
level: advanced
minutes: 8
goals:
  - "用 regexp 判断是否匹配"
  - "取出第一处匹配"
  - "替换匹配到的文本"
sources:
  - gobyexample
updated: "2026-10-15"
---

`regexp` 使用 RE2 语法。模式写在原始字符串里，反斜杠不用再转义一层。

### 是否匹配

`MatchString` 返回是否匹配，以及编译或匹配过程中的错误。

```go run expect="true" title="含有数字"
package main

import (
	"fmt"
	"regexp"
)

func main() {
	ok, err := regexp.MatchString(`\d+`, "房号 18")
	fmt.Println(ok && err == nil)
}
```

输出是 `true`。

### 取出匹配

`MustCompile` 在模式非法时 panic。模式正确时，`FindString` 返回第一处匹配。

```go run expect="18" title="第一处数字"
package main

import (
	"fmt"
	"regexp"
)

func main() {
	re := regexp.MustCompile(`\d+`)
	fmt.Println(re.FindString("房号 18 室"))
}
```

输出是 `18`。

### 替换

`ReplaceAllString` 把每一处匹配换成给定文本。

```go run expect="a b" title="压缩空白"
package main

import (
	"fmt"
	"regexp"
)

func main() {
	re := regexp.MustCompile(`\s+`)
	fmt.Println(re.ReplaceAllString("a  b", " "))
}
```

输出是 `a b`。

### 非法模式

`Compile` 返回错误，不会让整个程序 panic。模式没写完时，错误不是 `nil`。

```go run expect="true" title="编译失败"
package main

import (
	"fmt"
	"regexp"
)

func main() {
	_, err := regexp.Compile("[")
	fmt.Println(err != nil)
}
```

输出是 `true`。
