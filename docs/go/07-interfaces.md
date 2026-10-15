---
language: go
chapter: 7
title: "接口"
level: intermediate
minutes: 18
goals:
  - "用隐式实现满足接口"
  - "做类型断言"
  - "实现 Stringer"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

接口只描述方法。只要类型拥有这些方法，就自动满足接口，不用写 implements。

类型断言 `v.(T)` 有两个返回值时不会 panic。`fmt` 打印时如果发现 `String() string`，会用它。

```go run expect="12" title="形状"
package main

import "fmt"

type Shape interface{ Area() int }

type Rect struct{ W, H int }

func (r Rect) Area() int { return r.W * r.H }

func main() {
	var s Shape = Rect{3, 4}
	fmt.Println(s.Area())
}
```

```go run expect="user:Ada" title="Stringer"
package main

import "fmt"

type User struct{ Name string }

func (u User) String() string { return "user:" + u.Name }

func main() {
	fmt.Println(User{Name: "Ada"})
}
```

```go run expect="43" title="类型断言"
package main

import "fmt"

func main() {
	var v any = 42
	if n, ok := v.(int); ok {
		fmt.Println(n + 1)
	}
}
```

接口只列出方法。类型不用声明自己实现了哪个接口，方法对上就行。小接口更好组合。一个只有一个方法的接口，比一次要求十个方法的接口容易满足。

接口值里既有类型也有值。把具体类型放进接口再调用方法，走的是动态派发。fmt 打印时如果看到 String() string，就用它，这就是 Stringer。方法要定义在你希望打印的那个类型上。

类型断言有两种写法。v.(T) 在类型不对时 panic。v.(T) 配 ok 则安全。教学例子用 ok。switch v := x.(type) 可以一次分几种类型。

自定义 error 是一个只有 Error() string 的接口。Yaegi 0.16 把你自己的类型放进 error 再调用方法时会 panic。能跑的例子改用 errors.New。只读块里保留那个写法，提醒你这是解释器的限制，不是 Go 的规则。

接口是方法集，不是字段集。你不能在接口里要求一个公开字段。需要数据就通过方法拿，或者断言回具体类型再读字段。断言失败时 ok 为 false，不要继续用零值假装成功。

String 方法如果写成值接收者，值和指针都能用。fmt 打印指针时也会尝试解引用找 Stringer。本章打印值，减少一层指针。

error 接口只有一个方法。标准库的 errors.New 返回的具体类型不是你写的，调用 Error() 在 Yaegi 里是安全的。自己写的类型放进 error 变量再调用，会触发已知的 panic，所以只读。

接口只列出方法，不列出字段。类型不用声明自己实现了哪个接口，方法集对上就行。小接口更容易满足。一个只有一个方法的接口，比一次要求很多方法的接口好写。需要数据就通过方法拿，或者断言回具体类型再读字段。

接口值里既有动态类型也有动态值。调用方法走动态派发。类型断言 v.(T) 在类型不对时 panic。教学例子写成 s, ok := v.(T)，ok 为 false 时不要继续用零值假装成功。type switch 可以一次分几种类型，本章能用 if 写清的就用 if。

fmt 打印时如果类型有 String() string，会用它。方法要定义在你希望打印的那个类型上，并且接收者种类要一致。

自定义 error 是只有 Error() string 的接口。Yaegi 把你自己的类型放进 error 再调用方法时会 panic。能跑的例子用 errors.New。只读块里保留自定义写法，用来标明这是解释器的限制，不是 Go 的规则。不要在可运行答案里调用自定义错误的 Error 方法。

### 读「小接口」

先做这一例。代码收成一行是 `package main import "fmt" type Printer interface{ Out() string } type Text string func (t Text) Out() string { return string(t) } func main() { var p Printer = …`。先盖住终端，用手算结果，纸上的文本里要能找到「hi」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「hi」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「安全断言」

做完上一个再做这一例。代码收成一行是 `package main import "fmt" func main() { var v any = "go" if s, ok := v.(string); ok { fmt.Println(len(s)) } }`。先盖住终端，用手算结果，纸上的文本里要能找到「2」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「2」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：接口保持小，用方法集去满足，不写 implements。 用「小接口」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：断言后加一」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：类型断言总是接住 ok，避免 panic。 用「安全断言」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：断言后加一」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：自定义 error 在本环境标成只读，可运行代码用 errors.New。 用「小接口」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：断言后加一」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：把整数放进 any，断言成 int 后加 1 并打印。 做完再对照「参考答案：断言后加一」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：接口由方法集隐式满足。断言要带 ok。自定义 error 在 Yaegi 里不可靠，示例改用标准库的错误值。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```go run expect="hi" title="小接口"
package main

import "fmt"

type Printer interface{ Out() string }

type Text string

func (t Text) Out() string { return string(t) }

func main() {
	var p Printer = Text("hi")
	fmt.Println(p.Out())
}
```

```go run expect="2" title="安全断言"
package main

import "fmt"

func main() {
	var v any = "go"
	if s, ok := v.(string); ok {
		fmt.Println(len(s))
	}
}
```

## 练习

定义一个只有 `Error() string` 的类型，并打印它。

```go norun title="自定义 error"
package main

// 只读：Yaegi 0.16 把自定义 error 放进接口再调用方法时会 panic。
// type Oops struct{}
// func (Oops) Error() string { return "oops" }
```

::: answer 参考答案
```go run expect="oops" title="参考答案"
package main

import (
	"errors"
	"fmt"
)

func main() {
	err := errors.New("oops")
	fmt.Println(err.Error())
}
```
:::

把整数放进 any，断言成 int 后加 1 并打印。

::: answer 参考答案：断言后加一
```go run expect="42" title="参考答案"
package main

import "fmt"

func main() {
	var v any = 41
	if n, ok := v.(int); ok {
		fmt.Println(n + 1)
	}
}
```
:::

## 最佳实践

- 接口保持小，用方法集去满足，不写 implements。
- 类型断言总是接住 ok，避免 panic。
- 自定义 error 在本环境标成只读，可运行代码用 errors.New。

## 小结

接口由方法集隐式满足。断言要带 ok。自定义 error 在 Yaegi 里不可靠，示例改用标准库的错误值。

## 常见错误

- 类型断言不接 ok，类型不对时 panic。
- 接口里放大方法集。实现者要全部满足，小接口更好组合。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
