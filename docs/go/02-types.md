---
language: go
chapter: 2
title: "基本类型与格式化"
level: beginner
minutes: 18
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

int、float64、string、bool 是最常用的四种。rune 是 int32 的别名，表示一个 Unicode 码点。byte 是 uint8 的别名。字符串的 len 数的是字节，range 字符串时每次得到的是 rune。中文「你」占三个字节、一个 rune，所以两种数法不一样。

Printf 的格式动词要和类型匹配。%d 给整数，%s 给字符串，%q 给带引号的字符串，%.1f 给浮点并保留一位小数。动词用错会在输出里看到百分号提示，而不是你要的数字。Println 按默认格式并换行，适合快速看值。

浮点打印如果不限制位数，可能很长。示例用 %.1f 或先算出整数。不要把某一次打印的长小数写进期望。

零值不用你赋值也存在：数字是 0，字符串是空，布尔是 false，指针是 nil。var 声明而不赋值就会得到零值。:= 则必须有右边。

格式动词写错时，Printf 会输出 %!d(string=...) 这种提示。看到百分号开头的怪字符串，先回去对动词，而不是改数据。Println 没有这个问题，它按默认格式。

range 字符串时第一个变量是字节下标，不是第几个字。第二个才是 rune。只写 for _, r := range s 可以忽略下标。累加次数就得到字数。

零值让你少写初始化，也会掩盖「忘记赋值」。如果 0 是合法业务值，就再配一个布尔表示是否已设置，不要单靠 0 判断。

len 对字符串数字节，不数字符。英文一个字母通常是一个字节，汉字不是。range 字符串时给出的是每个码点，教学里用 range 来数汉字，用 len 来提醒字节。不要把 len 的结果直接当成「有几个字」写进界面。

Printf 的动词要和类型匹配。%d 用于整数，%s 用于字符串，%f 用于浮点，%.1f 保留一位小数。动词写错时，输出里会出现百分号开头的提示，而不是你要的数。看到这种提示，先改动词。Println 按默认格式，参数之间加空格并换行。Print 不换行，适合演示 defer 的紧凑输出。浮点示例用能够精确表示的数，避免四舍五入的方向引起歧义。

零值在这一章要能认出来。声明 var n int 然后打印，得到 0，不是空行，也不是 panic。指针的零值是 nil，对 nil 指针取值会 panic。示例在取值前先让指针指向一个变量。

类型转换要显式。int 和 int64 不会自动混算。转换可能丢掉范围，练习用小整数，先把语法写对。

### 读「零值」

先做这一例。代码收成一行是 `package main import "fmt" func main() { var n int fmt.Println(n) }`。先盖住终端，用手算结果，纸上的文本里要能找到「0」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「0」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「一位小数」

做完上一个再做这一例。代码收成一行是 `package main import "fmt" func main() { fmt.Printf("%.1f\n", 2.0) }`。先盖住终端，用手算结果，纸上的文本里要能找到「2.0」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「2.0」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：数中文字符用 range，数字节才用 len。 用「零值」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：两个字节」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：Printf 的动词和类型对齐，并自己加换行。 用「一位小数」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：两个字节」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：需要稳定输出时限制浮点位数。 用「零值」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：两个字节」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：打印字符串 Go 的字节长度。 做完再对照「参考答案：两个字节」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：len 对字符串数字节，range 才按字。Printf 用动词控制格式，未赋值的变量保持零值。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```go run expect="0" title="零值"
package main

import "fmt"

func main() {
	var n int
	fmt.Println(n)
}
```

```go run expect="2.0" title="一位小数"
package main

import "fmt"

func main() {
	fmt.Printf("%.1f\n", 2.0)
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

打印字符串 Go 的字节长度。

::: answer 参考答案：两个字节
```go run expect="2" title="参考答案"
package main

import "fmt"

func main() {
	fmt.Println(len("Go"))
}
```
:::

## 最佳实践

- 数中文字符用 range，数字节才用 len。
- Printf 的动词和类型对齐，并自己加换行。
- 需要稳定输出时限制浮点位数。

## 小结

len 对字符串数字节，range 才按字。Printf 用动词控制格式，未赋值的变量保持零值。

## 常见错误

- 用 len 判断中文有几个字。len 返回字节数。
- Printf 忘记换行，两行结果粘在一起。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
