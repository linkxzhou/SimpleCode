---
language: go
chapter: 11
title: "一张单子把前面的零件接上"
level: intermediate
minutes: 30
goals:
  - "在一份文件里写出带商品的订单结构体"
  - "让 Total 在件数非法时返回 error"
  - "用切片累计多笔合法订单的金额"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

前面每一章只加一种机制。这一章把它们放回同一笔账：商品嵌在订单里，订单放进切片，每一笔用 `Total` 返回金额或错误，`main` 把合法的金额加起来。仍然是一份文件，`package main`，一个 `func main`。茶 1800 分，包子 600 分。两杯茶是 3600，三个包子是 1800，一起是 5400。

没有第二个包。计价函数、结构体和入口都写在这一份源码里，因为抽屉的解释器只接受眼前这一块。拆成 `item.go` 和 `order.go` 是工程上的下一步，不是这一块能运行的形状。读的时候可以把类型放在上面，`main` 放在下面。解释器读完整份文件再调用 `main`，次序不影响能不能找到 `Total`。

`Item` 只有名称和单价。`Order` 嵌入 `Item`，再加件数。嵌入让 `o.Cents` 和 `o.Name` 可以直接写。`Total` 用值接收者，因为它不修改订单，只计算。件数小于等于 0，返回 `errors.New("qty")`。单价小于 0，返回 `fmt.Errorf("price %d", cents)`。两个检查都通过，返回件数乘单价和 nil。不定义自己的错误类型，避免在这个解释器里通过接口调用自定义的 `Error` 方法。

先算一整张合法的单子。切片用字面量造出来，两笔订单都是非 nil 的结构体值，不需要 `make`。字面量已经把长度放好。循环里调用 `Total`，任何一笔失败就打印原因并返回，成功就把金额加入 `sum`。两笔都成功时打印 5400。

```go run expect="5400" title="茶和包子的合计"
package main

import (
	"errors"
	"fmt"
)

type Item struct {
	Name  string
	Cents int
}

type Order struct {
	Item
	Qty int
}

func (o Order) Total() (int, error) {
	if o.Qty <= 0 {
		return 0, errors.New("qty")
	}
	if o.Cents < 0 {
		return 0, fmt.Errorf("price %d", o.Cents)
	}
	return o.Qty * o.Cents, nil
}

func main() {
	orders := []Order{
		{Item: Item{Name: "tea", Cents: 1800}, Qty: 2},
		{Item: Item{Name: "bun", Cents: 600}, Qty: 3},
	}
	sum := 0
	for _, o := range orders {
		n, err := o.Total()
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		sum += n
	}
	fmt.Println(sum)
}
```

循环变量 `o` 是每一笔的副本。`Total` 是值接收者，副本够用。即便改成指针接收者，`range` 的变量也是副本，取它的地址不会指回切片里的那一格。要修改切片里的订单，按下标写 `orders[i]`。这一章的循环只读，副本不会造成「改了却没写回」。金额加进 `sum`，`sum` 是 `main` 里的局部变量，不放进订单结构体。合计是整张单子的结果，不是某一笔的字段。

失败时停住。把包子的件数改成 0，茶仍然合法。循环先加上 3600，再在包子上得到 `qty`，打印原因并 `return`。`sum` 已经是 3600，可是 `return` 发生在打印合计之前，终端里只有 `qty`。客人看不到一个残缺的合计。这是「整张单子要么全部入账，要么一笔都不报合计」的策略。实现上茶的金额已经加进局部变量，只是局部变量没被打印。函数一返回，局部变量消失，没有半张单子留在外面。

```go run expect="qty" title="件数非法就停"
package main

import (
	"errors"
	"fmt"
)

type Item struct {
	Cents int
}

type Order struct {
	Item
	Qty int
}

func (o Order) Total() (int, error) {
	if o.Qty <= 0 {
		return 0, errors.New("qty")
	}
	return o.Qty * o.Cents, nil
}

func main() {
	orders := []Order{
		{Item: Item{Cents: 1800}, Qty: 2},
		{Item: Item{Cents: 600}, Qty: 0},
	}
	sum := 0
	for _, o := range orders {
		n, err := o.Total()
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		sum += n
	}
	fmt.Println(sum)
}
```

另一种策略是跳过坏行，继续加后面的。那适合导入历史订单：一行坏了，不应让后面的包子消失。策略要写在契约里。上面的块选择停住，所以期望是 `qty` 而不是 3600。若改成跳过，就不要在错误时 `return`，用 `continue`，并且另计一笔失败次数。两种都不要把 0 加进 `sum` 再假装成功。`Total` 在失败时返回的 0 只是占位，调用者必须先看 `err`。

第三块只走一笔，把名称也打印出来，确认嵌入的字段还在。一杯茶，金额 1800，输出 `tea 1800`。`Total` 不返回名称，名称从订单上读。金额和名称分成两个渠道：金额可能失败，名称在这张结构体上总是一个字符串，空串也是字符串。不要让 `Total` 顺便返回名称，签名会膨胀成三样东西。需要一起搬走时，再考虑一个结果结构体。现在打印处离开订单只有两步，分两次取更清楚。

```go run expect="tea 1800" title="名称和这一笔金额"
package main

import (
	"errors"
	"fmt"
)

type Item struct {
	Name  string
	Cents int
}

type Order struct {
	Item
	Qty int
}

func (o Order) Total() (int, error) {
	if o.Qty <= 0 {
		return 0, errors.New("qty")
	}
	return o.Qty * o.Cents, nil
}

func main() {
	o := Order{Item: Item{Name: "tea", Cents: 1800}, Qty: 1}
	n, err := o.Total()
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Println(o.Name, n)
}
```

切片的每一笔都是值。把切片传给一个函数，传的是切片头，底层数组仍共享。函数若按下标修改 `orders[i].Qty`，调用者看得见。函数若只是 `range` 出副本再改副本，调用者看不见。合计函数若签名是 `func Sum(orders []Order) (int, error)`，它只读，用值接收者的 `Total`，和这一章的循环相同。返回错误时，约定仍然是「不要使用同时返回的那个整数」。可以把失败的下标放进 `fmt.Errorf("row %d: %w", i, err)`，让调用者知道是第几笔。`%w` 保住内层的 `qty`，外层加上位置。这一章的可运行块在循环里直接打印，没有再包一层，是为了让终端上的词就是 `qty` 本身。

单价表没有放进这一章的运行块。商品的价格已经抄进每一笔 `Item` 里。抄进去是成交价：之后店里的茶涨价，这张切片里的 1800 不变。若订单只存商品名，计价时再查映射，映射必须先 `make`，并且查不到时要有错误，不能把 0 当成标价。两种存法都对。切片里存成交价，单子可以独立计算，测试也不用先准备一张表。映射里存当前标价，改价只改一处，但每一笔的历史会被改价影响。小店的这一章选择成交价跟着订单走。

零值订单若被放进切片，`Total` 会因为件数为 0 返回 `qty`。这正是零值那一章的取舍落到账上的样子：空单能存在于切片里，计算时被拒绝。拒绝发生在 `Total`，不发生在「结构体无法构造」。你可以 `append` 一张 `Order{}`，然后在合计时得到错误。这比让切片无法存放空单更灵活，也要求合计不要忘记检查。

并发不放进合计。两笔订单都很小，循环比通道直白。若以后每一笔都要访问慢的计价规则，可以让每一笔向容量够用的通道发送结果，`main` 接收固定次数再相加。接收次数必须等于发送次数，不能靠 `Sleep`。在规则还是乘法的时候，通道只会把 5400 的来源拆散。留在循环里，读代码的人能看见 1800、600 和件数。

泛型也不是这张单子的主角。金额的类型就是 `int`。`Pick` 能取出切片里的某一笔订单，但取出之后仍然要调用 `Total`。把 `Total` 写成泛型并不会去掉错误检查。接口 `Priced` 可以让茶和包子以不同结构体混在一个切片里。这一章让它们共用 `Order`，用商品字段区分，是因为失败原因和件数规则相同。规则相同就用一个类型。规则分叉再拆类型并收成接口。

这份文件因此是一条可以单独运行的结账路径：嵌入的商品、带错误的乘法、切片上的循环、先检查再累计。缺了哪一段，终端里的 5400 就不再表示「两笔都合法」。件数非法时你看见的是 `qty`，不是一个安静的 0。

[Go by Example](https://gobyexample.com/) 把这些语法分在不同的页上。[Learn Go with Tests](https://quii.gitbook.io/learn-go-with-tests) 会为 `Total` 这种函数写表驱动的测试，一列是合法的茶，一列是件数为 0。这里用两次运行为这两列各留下一个期望：`5400` 和 `qty`。

把合计写成函数，签名是 `func Sum(orders []Order) (int, error)`。函数内部的循环和 `main` 里一样。失败时返回 0 和那笔的错误，成功时返回合计和 nil。`main` 只负责构造切片和打印。这样同一份规则可以在心里被调用两次：一次全是合法订单，一次夹着件数 0。两次的差别只在输入，不在循环怎么写。抽屉里为了让每一块都能单独 Run，规则被抄进了每个块。抄写是运行方式的代价。你在自己的工程里应只留一份 `Total` 和一份 `Sum`。

成交价抄进 `Item` 之后，改价要改新订单，不改旧切片。若业务是「未付款的单子跟随标价」，就不要把 `Cents` 放进订单，只放商品名，计价时查表。查表失败是另一种错误，用 `fmt.Errorf` 包上商品名。本章选择成交价，是因为示例没有第二张会变动的表，5400 可以只由切片推出来。推得出来，期望才能写死。

切片的顺序就是小票的顺序。先茶后包子，不是映射遍历的随机序。若你把订单放进 `map[int]Order` 再用 `range` 打印，次序会变，5400 的加总仍然对，因为加法可交换，但一行行的清单会对不上。合计用切片。需要按编号查找时再配一张映射，映射的值存编号，切片才是主清单。主清单只有一份，避免改了切片忘了改映射。

`Total` 不在这里使用 `defer`。没有文件要关，没有日志必须在每个返回点打印。若以后要在计价结束时计数，再在 `Total` 开头 defer 一次计数。计数若放在每个 `return` 前，两个返回点会漏一个。现在返回点只有错误和成功两类，调用者已经能从 `err` 看出类别，不必再数。把 defer 留到真有成对动作的时候，这一章的文件才读得短。

最后核对一次数字。茶的单价 1800，两件，3600。包子的单价 600，三件，1800。合计 5400。件数为 0 的任何一笔都让整张合计不打印，终端里是 `qty`。单价为负时文本里带有 `price` 和那个负数。这三个输出是整门课的落点。对不上时，从这一份文件的 `Total` 往回看，不要从解释器的乘法看起。

练习里的四个包子是 2400，负单价的文本里要出现减号。两道题各用一份完整的 `package main`，不要依赖本章前面块里的类型还留在内存里。每一块重新声明 `Order` 和 `Total`。重复声明是抽屉的约束，也让答案能单独阅读：看见 `Qty <= 0` 就知道为什么 0 件不会算出 0 元的成功，看见 `Cents < 0` 就知道负数会进错误文本。合计只在循环里 `err == nil` 时增加。这三句话是整张单子的契约。

若要把名称也放进失败文本，用 `fmt.Errorf("%s price %d", o.Name, o.Cents)`，期望改成包含商品名的那一行。不要为了名称去定义一个错误结构体。文本由 `fmt.Errorf` 组装就够了。名称是数据，格式串是你写的固定句子，两者的位置不要对调，免得哪天名称里出现百分号，被误当成格式。

切片为空时循环不进入，合计保持 0，`err` 也没有机会变成非 nil。打印出来的 0 表示「没有订单」，和「有一笔但件数为 0」不同，后者会打印 `qty`。空切片是一张空白小票，非法件数是一张写错的小票。两种都要能从输出上分开。本章的例子至少有一笔，所以不会落到空白小票的 0 上。你自己加一块空切片时，期望应是 0，并且源码里不要再伪造一笔零值订单，否则 `Total` 会把空白变成 `qty`。

`main` 里的 `sum` 从 0 开始，这个 0 是累加器的零值，不是某一笔的金额。它会在第一笔成功后变成 3600，在第二笔成功后变成 5400。若第一笔就失败，`sum` 仍是 0，但函数已经返回，0 不会被打印。累加器的零值和失败时返回的 0 因此不会在终端里相遇。

## 小结

一份文件里的 `Order` 嵌入商品，`Total` 返回金额和 `error`，切片循环在错误时打印 `qty` 并停止，全部合法时打印 5400。成交价写在每一笔上。0 只有在 `err` 为 nil 时才能加进合计。到这里，从入口、声明、复制、容器、接口、错误、defer、零值、嵌入、通道到泛型，都在同一笔订单上用过了。

## 练习

切片里只放四个包子，单价 600。打印 `Total` 的合计 2400。

::: answer 参考答案：只卖包子
```go run expect="2400" title="参考答案"
package main

import (
	"errors"
	"fmt"
)

type Order struct {
	Cents int
	Qty   int
}

func (o Order) Total() (int, error) {
	if o.Qty <= 0 {
		return 0, errors.New("qty")
	}
	return o.Qty * o.Cents, nil
}

func main() {
	orders := []Order{{Cents: 600, Qty: 4}}
	sum := 0
	for _, o := range orders {
		n, err := o.Total()
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		sum += n
	}
	fmt.Println(sum)
}
```
:::

一笔订单单价写成 -5，件数 1。打印 `fmt.Errorf` 产生的 `price -5`。不要打印金额。

::: answer 参考答案：拒绝负单价
```go run expect="price -5" title="参考答案"
package main

import "fmt"

type Order struct {
	Cents int
	Qty   int
}

func (o Order) Total() (int, error) {
	if o.Cents < 0 {
		return 0, fmt.Errorf("price %d", o.Cents)
	}
	return o.Qty * o.Cents, nil
}

func main() {
	o := Order{Cents: -5, Qty: 1}
	_, err := o.Total()
	if err != nil {
		fmt.Println(err.Error())
	}
}
```
:::
