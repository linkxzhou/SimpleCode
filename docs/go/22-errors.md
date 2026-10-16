---
language: go
chapter: 22
title: "Go 错误处理"
level: advanced
minutes: 8
goals:
  - "用返回值报告失败"
  - "用 errors.New 构造错误"
  - "用 errors.Is 识别被包装的哨兵错误"
sources:
  - gobyexample
updated: "2026-10-15"
---

Go 的失败通常是一个 `error` 返回值，而不是抛出的异常。调用方要看这个值是不是 `nil`。

### 返回 error

成功时错误为 `nil`。失败时给出非 `nil` 的错误，同时不要使用那个无效结果。

```go run expect="true" title="非法除数"
package main

import (
	"errors"
	"fmt"
)

func div(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("divisor  0")
	}
	return a / b, nil
}

func main() {
	_, err := div(4, 0)
	fmt.Println(err != nil)
}
```

输出是 `true`。

### errors.New

`errors.New` 用一段文本造出一个错误。打印它会看到这段文本。

```go run expect="soldout" title="错误文本"
package main

import (
	"errors"
	"fmt"
)

func main() {
	err := errors.New("soldout")
	fmt.Println(err)
}
```

输出是 `soldout`。

### 包装与 errors.Is

`fmt.Errorf` 的 `%w` 把已有错误包进新错误。两次 `errors.New` 即使文本相同也不是同一个错误，比较要用事先声明的变量。

```go run expect="true" title="哨兵错误"
package main

import (
	"errors"
	"fmt"
)

var errSoldOut = errors.New("soldout")

func main() {
	err := fmt.Errorf("order: %w", errSoldOut)
	fmt.Println(errors.Is(err, errSoldOut))
}
```

输出是 `true`。

### 自定义类型不要放进 error 再调用

这个解释器在把自定义错误放进 `error` 接口、再调用 `Error` 时会 panic。可运行例子只用 `errors.New`。

```go norun title="Yaegi 会 panic"
type myErr struct{ msg string }

func (e myErr) Error() string { return e.msg }

var err error = myErr{msg: "broken"}
err.Error()
```
