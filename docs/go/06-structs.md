---
language: go
chapter: 6
title: "结构体与方法"
level: intermediate
minutes: 18
goals:
  - "定义 struct"
  - "区分值接收者和指针接收者"
  - "用嵌入复用字段"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

结构体是一组字段。方法写在类型后面：值接收者拿到副本，指针接收者可以改原对象。

嵌入不是继承。内层类型的字段和方法会被提升，外面可以直接调用。

```go run expect="Ada 125" title="账户"
package main

import "fmt"

type Account struct {
	Owner   string
	Balance int
}

func (a *Account) Deposit(n int) {
	a.Balance += n
}

func main() {
	acc := Account{Owner: "Ada", Balance: 100}
	acc.Deposit(25)
	fmt.Println(acc.Owner, acc.Balance)
}
```

```go run expect="12" title="矩形"
package main

import "fmt"

type Rect struct{ W, H int }

func (r Rect) Area() int { return r.W * r.H }

func main() {
	fmt.Println(Rect{W: 3, H: 4}.Area())
}
```

```go run expect="3 原点旁" title="嵌入"
package main

import "fmt"

type Point struct{ X, Y int }

type Named struct {
	Point
	Name string
}

func main() {
	n := Named{Point: Point{1, 2}, Name: "原点旁"}
	fmt.Println(n.X+n.Y, n.Name)
}
```

结构体把字段放在一起。字段名大写表示包外可见，小写只在本包可见。示例都在 package main，小写也能在 main 里用。一旦你把类型想成库，就用大写导出需要被外面看到的字段。

值接收者拿到副本，改字段不会影响调用方。指针接收者改的是原对象。需要修改时用指针。只是读取、结构体又很小时，值接收者更简单。Go 会自动取地址：值变量也能调用指针接收者的方法。

嵌入把另一个结构体写进字段且不写字段名。外层会提升内层的字段和方法。同名时外层优先。这不是继承，没有子类关系，只是少写一层名字。

字面量可以用字段名，也可以按顺序。有名字的字面量不怕以后插入字段。教程用名字，读的人不用数位置。

方法名的接收者写在 func 关键字和名字之间。忘记括号会变成普通函数。接收者名字习惯用类型的首字母，不要用 this 或 self，虽然能编译，但不是 Go 的读法。

值接收者的方法用指针也能调用，反过来指针接收者的方法用可取地址的变量也能调用。nil 指针不能自动取值。字面量 Point{1, 2}.shift() 这种临时值不能取地址，先放进变量再调用指针方法。

嵌入的字段名默认就是类型名。外层写 n.X 实际是 n.Point.X。如果外层也有 X，提升就被挡住，必须写内层的名字才能拿到里面那个。

结构体把字段放在一起。字段名大写表示包外可见，小写只在本包。示例都在 package main，小写也能在 main 里用。一旦把类型想成库，就用大写导出需要被外面构造的字段。字面量写上字段名，以后插入字段也不用数位置。

方法的接收者写在 func 和名字之间。值接收者拿到副本，改字段不会影响调用方。指针接收者改的是原对象。需要修改时用指针，并把修改后的字段打印出来核对。只是读取、结构体又很小时，值接收者更简单。值变量也可以调用指针接收者的方法，语言会取地址。接收者名字用类型的首字母，不用 this 或 self。

方法要定义在包一级的类型上。写在函数内部的类型上，这个解释器无法处理。示例因此把 type 和 func 都放在 main 外面。

嵌入把另一个结构体写进字段且不写字段名，外层会提升内层的字段和方法。同名时外层优先。这不是继承，没有子类关系，只是少写一层名字。不要用嵌入去模拟类的层次。

### 读「值不变」

先做这一例。代码收成一行是 `package main import "fmt" type Point struct{ X, Y int } func (p Point) echo() int { return p.X } func main() { p := Point{1, 2} fmt.Println(p.echo()) }`。先盖住终端，用手算结果，纸上的文本里要能找到「1」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「1」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「指针改变」

做完上一个再做这一例。代码收成一行是 `package main import "fmt" type Point struct{ X, Y int } func (p *Point) shift() { p.X++ } func main() { p := Point{1, 2} p.shift() fmt.Println(p.X) }`。先盖住终端，用手算结果，纸上的文本里要能找到「2」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「2」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：会修改字段的方法用指针接收者，并把返回值或原变量的变化打印出来核对。 用「值不变」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：加一」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：结构体字面量写上字段名。 用「指针改变」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：加一」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：嵌入用来少写一层访问，不要把它理解成类继承。 用「值不变」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：加一」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：定义带 X 的结构体和返回 X+1 的值接收者方法，打印 X 为 41 的结果。 做完再对照「参考答案：加一」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：结构体用字段名聚合数据。值接收者改副本，指针接收者改原对象。嵌入提升字段，但不是继承。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```go run expect="1" title="值不变"
package main

import "fmt"

type Point struct{ X, Y int }

func (p Point) echo() int { return p.X }

func main() {
	p := Point{1, 2}
	fmt.Println(p.echo())
}
```

```go run expect="2" title="指针改变"
package main

import "fmt"

type Point struct{ X, Y int }

func (p *Point) shift() { p.X++ }

func main() {
	p := Point{1, 2}
	p.shift()
	fmt.Println(p.X)
}
```

## 练习

给 Point 加一个 Dist 方法，返回 X 和 Y 的和的绝对值，打印 (1, -4)。

::: answer 参考答案
```go run expect="3" title="参考答案"
package main

import "fmt"

type Point struct{ X, Y int }

func (p Point) Manhattan() int {
	s := p.X + p.Y
	if s < 0 {
		return -s
	}
	return s
}

func main() {
	fmt.Println(Point{1, -4}.Manhattan())
}
```
:::

定义带 X 的结构体和返回 X+1 的值接收者方法，打印 X 为 41 的结果。

::: answer 参考答案：加一
```go run expect="42" title="参考答案"
package main

import "fmt"

type Num struct{ X int }

func (n Num) Next() int { return n.X + 1 }

func main() {
	fmt.Println(Num{41}.Next())
}
```
:::

## 最佳实践

- 会修改字段的方法用指针接收者，并把返回值或原变量的变化打印出来核对。
- 结构体字面量写上字段名。
- 嵌入用来少写一层访问，不要把它理解成类继承。

## 小结

结构体用字段名聚合数据。值接收者改副本，指针接收者改原对象。嵌入提升字段，但不是继承。

## 常见错误

- 值接收者里修改字段，调用后原值不变。需要修改就用指针接收者。
- 嵌入的字段和外部字段同名，提升会被挡住。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
