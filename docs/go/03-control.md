---
language: go
chapter: 3
title: "控制流"
level: beginner
minutes: 18
goals:
  - "写 if、for 和 switch"
  - "用 defer 推迟调用"
  - "判断质数"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

Go 只有 `for` 一种循环。条件两边不要加括号。`switch` 默认每个分支结束就离开，不用写 break。

`defer` 把调用推迟到当前函数返回前，多个 defer 按后进先出执行。

```go run expect="1 2 Fizz 4 Buzz Fizz 7" title="FizzBuzz"
package main

import "fmt"

func main() {
	for n := 1; n <= 7; n++ {
		switch {
		case n%15 == 0:
			fmt.Print("FizzBuzz ")
		case n%3 == 0:
			fmt.Print("Fizz ")
		case n%5 == 0:
			fmt.Print("Buzz ")
		default:
			fmt.Print(n, " ")
		}
	}
	fmt.Println()
}
```

```go run expect="质数" title="质数"
package main

import "fmt"

func prime(n int) bool {
	if n < 2 {
		return false
	}
	for i := 2; i*i <= n; i++ {
		if n%i == 0 {
			return false
		}
	}
	return true
}

func main() {
	if prime(5) {
		fmt.Println("质数")
	}
}
```

```go run expect="abc" title="defer"
package main

import "fmt"

func main() {
	fmt.Print("a")
	defer fmt.Print("c")
	fmt.Print("b")
}
```

Go 只有 for 这一种循环。while 不是关键字，写成 for 条件 { }。无限循环写成 for { }，一定要有 break 或 return，否则和文档里那个需要停止的例子一样停不下来。条件两边不要加括号，加了也能编译，但不是这里的风格。

if 同样不加括号，花括号不能换到下一行。else 必须紧跟在右花括号后面。这是语法，不是格式化工具的偏好，换行会直接报错。

switch 默认每个分支结束就离开，不用 break。想贯穿时写 fallthrough。没有表达式的 switch 相当于一串 if else。case 里可以写条件。

defer 把调用推迟到当前函数返回前，多个 defer 后进先出。它适合关闭资源。不要在循环里 defer 打开的文件，它们要等到函数结束才关闭。打印顺序时用 Print 而不是 Println，否则换行会插在推迟的输出前面，看起来像顺序错了。

花括号的位置是语法的一部分。把 { 放到下一行，解析器认为 if 语句已经结束，下一行的 { 就成了多余的。格式化工具会帮你改，但手写时自己放对。

fallthrough 不判断下一个 case 的条件，直接进入下一支的语句。很少需要。本章的 switch 都不贯穿，每个分支自己打印并结束。

defer 的参数在执行 defer 那一行就求值，调用推迟到返回前。defer fmt.Print(n) 会记住当时的 n，而不是返回时的 n。循环里用 defer 抓循环变量时要特别小心，本章不在循环里 defer。

Go 的循环只有 for。三段 for 和别的语言的 for 类似：初始化、条件、后置。条件省略就是一直循环，必须在体内用 break 或 return 离开。range 用来走切片、map 和字符串。倒序时用三段 for，把起点设成最后一个下标，条件写成大于等于 0。

switch 默认不贯穿。匹配的一支执行完就离开，不必写 break。想落入下一支要显式写 fallthrough，本章的例子不这么做。switch 后面可以没有表达式，case 里写条件。

defer 把调用推迟到函数返回前，多个 defer 后进先出。先 defer B 再 defer A，返回时先执行 A 再执行 B。若在它们前面还有普通的打印 C，输出顺序是 C、A、B。用 Print 而不是 Println，是为了让这几个字母落在同一行，期望才能写成连续的字母。把 Println 放在 return 前会先打出换行，期望就对不上。

花括号不能单独换到下一行。解析器会认为 if 或 for 已经结束。手写时把左花括号留在同一行。

### 读「倒序」

先做这一例。代码收成一行是 `package main import "fmt" func main() { for n := 3; n >= 1; n-- { fmt.Println(n) } }`。先盖住终端，用手算结果，纸上的文本里要能找到「3」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「3」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「两个 defer」

做完上一个再做这一例。代码收成一行是 `package main import "fmt" func main() { defer fmt.Print("B") defer fmt.Print("A") fmt.Print("C") }`。先盖住终端，用手算结果，纸上的文本里要能找到「CAB」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「CAB」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：循环只用 for。条件不加括号，左花括号不换行。 用「倒序」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：偶数和」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：switch 不写多余的 break。需要贯穿再写 fallthrough。 用「两个 defer」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：偶数和」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：观察 defer 顺序时用 Print，避免 Println 的换行打乱前后。 用「倒序」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：偶数和」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：用 for 打印 2 和 4 的和。可以累加。 做完再对照「参考答案：偶数和」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：for 包办循环，switch 默认不贯穿。defer 在函数返回前按后进先出执行，打印时注意换行。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```go run expect="3" title="倒序"
package main

import "fmt"

func main() {
	for n := 3; n >= 1; n-- {
		fmt.Println(n)
	}
}
```

```go run expect="CAB" title="两个 defer"
package main

import "fmt"

func main() {
	defer fmt.Print("B")
	defer fmt.Print("A")
	fmt.Print("C")
}
```

## 练习

用 for 打印 3、2、1。

::: answer 参考答案
```go run expect="3\n2\n1" title="参考答案"
package main

import "fmt"

func main() {
	for n := 3; n >= 1; n-- {
		fmt.Println(n)
	}
}
```
:::

用 for 打印 2 和 4 的和。可以累加。

::: answer 参考答案：偶数和
```go run expect="6" title="参考答案"
package main

import "fmt"

func main() {
	sum := 0
	for n := 2; n <= 4; n += 2 {
		sum += n
	}
	fmt.Println(sum)
}
```
:::

## 最佳实践

- 循环只用 for。条件不加括号，左花括号不换行。
- switch 不写多余的 break。需要贯穿再写 fallthrough。
- 观察 defer 顺序时用 Print，避免 Println 的换行打乱前后。

## 小结

for 包办循环，switch 默认不贯穿。defer 在函数返回前按后进先出执行，打印时注意换行。

## 常见错误

- 把 while 写成关键字。Go 里就是 for 条件 { }。
- defer 写在循环里打开很多资源。它们要等到函数结束才执行。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
