---
language: go
chapter: 8
title: "错误处理"
level: intermediate
minutes: 18
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

错误是返回值，不是异常。函数签名里的 error 告诉调用方必须处理。用下划线丢掉 error，后面的结果往往是零值，程序会带着错的数继续跑。只有你证明这个调用不可能失败时才丢掉，并且写注释。

fmt.Errorf 的 %w 把原错误包进去。errors.Is 顺着包装找哨兵错误。errors.As 找具体类型。本章用 Is 就够。哨兵错误用 errors.New 放在变量里，比较的是那一个值，不是消息文本。

panic 留给无法继续的程序错误。recover 只能在 defer 的函数里接住。用 panic 处理用户输入是过度的，输入错误应该返回 error。示例里的 panic 只为了演示 recover，不要模仿到业务分支里。

Atoi 失败时 n 是 0。如果你忽略 err，会以为用户输入了 0。永远先看 err，再使用 n。

%w 只能包 error。把普通字符串塞进 %w 会在格式化时报错。哨兵错误用变量保存，消息可以相同，Is 比的是值。两个 errors.New("empty") 不是同一个错误，Is 会失败。

recover 返回的是传给 panic 的那个值，不一定是 error。示例打印固定文本，不依赖 panic 的参数长什么样。把 recover 写在普通函数里而不是 defer 里，它什么也接不住。

Atoi 的错误属于输入错误。打印「不是整数」比把 err 原样打出来更稳定，因为错误文本可能带引号和原始输入，测试子串会难写。

错误是返回值。函数签名里的 error 告诉调用方必须处理。先判断 err，再使用旁边的结果。Atoi 失败时整数结果是 0。忽略 err 会让你以为用户输入了 0。只有能证明不可能失败时才用下划线丢掉错误。

fmt.Errorf 的 %w 把原错误包进去。errors.Is 顺着包装找哨兵错误。哨兵用 errors.New 放在变量里，比较的是那一个值，不是消息文本。两个分别 New 出来的错误，即使文字相同，Is 也认不出。%w 只能包 error，把普通字符串塞进去会在格式化时报错。errors.As 用来找具体类型，本章用 Is 就够。

panic 留给无法继续的缺陷。recover 只能在 defer 的函数里接住。用 panic 处理用户输入是过度的，输入错误应该返回 error。示例里的 panic 只为了演示 recover，不要抄进正常分支。

包装错误时保留前缀，方便人读，同时用 Is 让程序仍能认出原因。测试打印一个固定的短词，不把整段错误文本当期望，避免空格一变就失败。

### 读「包装仍能认出」

先做这一例。代码收成一行是 `package main import ( "errors" "fmt" ) var errEmpty = errors.New("empty") func main() { err := fmt.Errorf("parse: %w", errEmpty) if errors.Is(err, errEmpty) { f…`。先盖住终端，用手算结果，纸上的文本里要能找到「empty」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「empty」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「先看错误」

做完上一个再做这一例。代码收成一行是 `package main import ( "fmt" "strconv" ) func main() { if _, err := strconv.Atoi("no"); err != nil { fmt.Println("bad") } }`。先盖住终端，用手算结果，纸上的文本里要能找到「bad」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「bad」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：先判断 error，再使用旁边的结果值。 用「包装仍能认出」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：解析 7」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：用 %w 和 errors.Is 保留原因，不比较错误消息的文字。 用「先看错误」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：解析 7」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：可预期的输入问题返回 error，panic 只留给演示 recover 或真正的缺陷。 用「包装仍能认出」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：解析 7」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：解析字符串 7，成功时打印加 1 后的数。 做完再对照「参考答案：解析 7」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：错误是返回值。包装之后用 errors.Is 辨认原因。panic 可以被 defer 里的 recover 接住，但不拿来处理普通输入。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```go run expect="empty" title="包装仍能认出"
package main

import (
	"errors"
	"fmt"
)

var errEmpty = errors.New("empty")

func main() {
	err := fmt.Errorf("parse: %w", errEmpty)
	if errors.Is(err, errEmpty) {
		fmt.Println("empty")
	}
}
```

```go run expect="bad" title="先看错误"
package main

import (
	"fmt"
	"strconv"
)

func main() {
	if _, err := strconv.Atoi("no"); err != nil {
		fmt.Println("bad")
	}
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

解析字符串 7，成功时打印加 1 后的数。

::: answer 参考答案：解析 7
```go run expect="8" title="参考答案"
package main

import (
	"fmt"
	"strconv"
)

func main() {
	n, err := strconv.Atoi("7")
	if err != nil {
		fmt.Println("bad")
		return
	}
	fmt.Println(n + 1)
}
```
:::

## 最佳实践

- 先判断 error，再使用旁边的结果值。
- 用 %w 和 errors.Is 保留原因，不比较错误消息的文字。
- 可预期的输入问题返回 error，panic 只留给演示 recover 或真正的缺陷。

## 小结

错误是返回值。包装之后用 errors.Is 辨认原因。panic 可以被 defer 里的 recover 接住，但不拿来处理普通输入。

## 常见错误

- 用 _ 丢掉 error。失败会变成后面的零值，很难查。
- panic 当普通分支用。可预期的输入错误应该返回 error。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
