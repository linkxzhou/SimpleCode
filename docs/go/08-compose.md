---
language: go
chapter: 8
title: "商品嵌在订单里"
level: intermediate
minutes: 28
goals:
  - "用嵌入字段复用商品的名称和单价"
  - "看出外层同名字段会挡住内层"
  - "让外层方法取代提升上来的方法"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

订单上已经有名称、件数、单价。名称和单价其实属于商品，件数才属于这一次购买。若再做一个「堂食订单」和一个「外带订单」，两边都抄一遍商品字段，改单价时要改两处。这一章把 `Item` 嵌进 `Order`。嵌入不是继承。没有父类，没有子类，也没有自动的超级调用。外层只是多了一个没有自己名字的字段，这个字段的类型是 `Item`。

```go
type Item struct {
    Name  string
    Cents int
}
type Order struct {
    Item
    Qty int
}
```

写在结构体里的 `Item` 没有字段名，字段名默认就是类型名 `Item`。同时，`Item` 的字段和方法会被提升，看起来像 `Order` 自己的一样。`o.Name` 实际是 `o.Item.Name`，`o.Cents` 实际是 `o.Item.Cents`。件数 `Qty` 是 `Order` 自己的字段，不在商品上。两杯茶：商品名 tea，单价 1800，件数 2，金额 3600。字面量要写出内层：`Order{Item: Item{Name: "tea", Cents: 1800}, Qty: 2}`。

```go run expect="tea 3600" title="提升上来的单价"
package main

import "fmt"

type Item struct {
	Name  string
	Cents int
}

type Order struct {
	Item
	Qty int
}

func main() {
	o := Order{Item: Item{Name: "tea", Cents: 1800}, Qty: 2}
	fmt.Println(o.Name, o.Cents*o.Qty)
}
```

提升是语法上的方便，内存上仍然是外层包含内层。`Order` 的值里躺着一整份 `Item`。把 `Order` 赋给另一个变量，内层商品一起被复制。改副本的 `Name`，原订单的商品名不变。这和结构体那一章的复制是同一条规则，没有因为「像继承」就变成共享。继承语言里子类对象常常和父类部分是同一对象的不同视角。这里的嵌入是组合：订单拥有一件商品，而不是订单是一种商品。

方法也会提升。`func (i Item) Label() string` 返回商品名。`Order` 没有自己的 `Label` 时，`o.Label()` 会找到内层的方法，接收者是那份 `Item` 的副本（值接收者）或地址（指针接收者）。下面打印 `tea`。调用点看起来像订单自己会报告名称，定义仍在商品上。商品改了标签的格式，所有嵌入它的订单一起变。这是复用。复用的边界也清楚：`Label` 看不见 `Qty`，因为接收者是 `Item`，不是 `Order`。要把件数放进标签，方法必须写在 `Order` 上。

```go run expect="tea" title="内层方法被提升"
package main

import "fmt"

type Item struct {
	Name string
}

func (i Item) Label() string {
	return i.Name
}

type Order struct {
	Item
	Qty int
}

func main() {
	o := Order{Item: Item{Name: "tea"}, Qty: 2}
	fmt.Println(o.Label())
}
```

外层可以声明同名字段，把内层挡住。`Order` 自己再加一个 `Name`，表示这张单在柜台上的别名，比如 `desk`。此时 `o.Name` 是外层的 `desk`，商品名要通过 `o.Item.Name` 才读得到，仍是 `tea`。提升不是合并。同名时外层赢，内层还在，只是选择器不再自动走进去。这种挡住很容易在加字段时发生：你为了加一个显示名，把原来能用的 `o.Name` 改了含义，所有当它是商品名的代码都悄悄指向新字段。加外层字段之前，先搜索这个名字已经在哪些字面量和调用里出现。

```go run expect="desk tea" title="外层名字挡住商品名"
package main

import "fmt"

type Item struct {
	Name string
}

type Order struct {
	Item
	Qty  int
	Name string
}

func main() {
	o := Order{Item: Item{Name: "tea"}, Qty: 2, Name: "desk"}
	fmt.Println(o.Name, o.Item.Name)
}
```

方法的挡住同样如此。`Order` 自己写 `Label`，`o.Label()` 就只用外层这一份，不会自动调用 `Item.Label`。内层方法还在，要写 `o.Item.Label()` 才会走到商品。下面外层返回 `order`，内层返回 `tea`。没有 `super.Label()` 这种调用。你若希望外层在商品名后面加件数，就在外层方法里自己调用 `o.Item.Label()`，再拼接数字。显式调用比隐式的超级调用更长，也更不容易在改名时链错。

```go run expect="order tea" title="外层方法自己说了算"
package main

import "fmt"

type Item struct {
	Name string
}

func (i Item) Label() string {
	return i.Name
}

type Order struct {
	Item
	Qty int
}

func (o Order) Label() string {
	return "order"
}

func main() {
	o := Order{Item: Item{Name: "tea"}, Qty: 2}
	fmt.Println(o.Label(), o.Item.Label())
}
```

选择嵌入而不是再套一层命名字段，看的是调用方要不要频繁写出内层名字。金额和商品名在每一笔订单上都会出现，提升让 `o.Cents` 够短。若内层只是实现细节，比如一块缓存，就给它一个小写字段名，不要嵌入，避免把缓存的方法提升到订单上，让订单的方法集变脏。方法集变脏的后果在接口那一章已经见过：多出来的方法可能意外满足某个接口。嵌入 `Item` 是因为订单在概念上就要暴露商品的名称和单价。

多个嵌入会带来同名冲突。假如又嵌入一个 `Pack`，它也有 `Name`，那么 `o.Name` 不再提升，必须写成 `o.Item.Name` 或 `o.Pack.Name`。冲突时编译器拒绝猜测。这是好事。猜测会让茶的名字和包装的名字在不同版本里互换。课程的 `Order` 只嵌入一个 `Item`，再加上自己的 `Qty`，选择器没有冲突。`o.Name` 稳定地是商品名，直到你像第三块那样自己加上同名字段。

指针嵌入 `*Item` 也合法。外层复制时复制的是指针，两份订单会共享同一件商品。改其中一个的单价，另一个跟着变。共享适合商品主数据：茶的标价只有一份，许多订单指向它。不适合「这一笔成交时的单价」。成交价应该是值，嵌一份 `Item` 的副本，之后店里的标价再变，这张单仍是 1800。这一章的可运行块全部嵌入值，金额因此跟着订单走。

零值的嵌入仍然可用。`var o Order` 时，内层 `Item` 也是零值，名称空串，单价 0，件数 0。`o.Label()` 若提升自值接收者，会返回空串，不会因为「父对象未构造」而崩溃。又一次：组合出来的零值是各部分零值的组合，不需要层级式的构造函数。需要拒绝空商品名时，在 `Order` 的计价函数里返回 `error`，不要在类型里假装有构造屏障。

[Go by Example](https://gobyexample.com/) 的结构体嵌入页能对上选择器。[Learn Go with Tests](https://quii.gitbook.io/learn-go-with-tests) 用组合来做假的依赖。这里的内层是真实的商品，不是测试替身。

嵌入和命名字段可以同时存在于设计草稿里，再决定留哪一个。命名字段 `item Item` 迫使调用方写 `o.item.Cents`。多出来的一层让「单价属于商品」在每个调用点都可见。嵌入把这一层收起来，调用点像订单自己有单价。收起来之后，新人可能以为 `Cents` 是 `Order` 声明的字段，去 `Order` 的字段列表里找不到，要再到 `Item` 里找。小类型可以接受这种查找。层次一多，提升链就难追。两层是这门课的上限：订单里面是商品，商品里面不再嵌入别的东西。

方法提升看的是方法集。值嵌入提升值接收者的方法。指针嵌入还会牵涉内层指针是否为 nil。`var o Order` 且嵌入的是 `*Item` 时，`o.Item` 是 nil，调用提升的方法若访问字段就会 panic。值嵌入没有这个洞。这是本章坚持嵌入值的又一个原因。成交价跟着订单复制，零值订单的商品也是零值商品，`Label` 返回空串，程序还在。

外层方法若想复用内层计算，就显式写出 `o.Item`。例如金额写成 `o.Item.Cents * o.Qty`。即便 `o.Cents` 现在能用，写成 `o.Item.Cents` 在「外层哪天加上自己的 Cents」之后也不会悄悄改含义。显式路径抗挡住。短路径省字符。订单示例在可运行块里用短路径 `o.Cents`，是因为那些块没有同名字段，短路径的含义稳定。第三块故意加上同名 `Name`，于是改用 `o.Item.Name` 去拿商品。两种写法对应两种结构，不要混用完还指望选择器猜中你的心意。

组合还可以是切片而不是嵌入。一张单子包含多件商品时，`Items []Item` 比嵌入一个 `Item` 更诚实。嵌入表达的是「这一笔只有一件商品，字段提升到订单上」。多件商品没有唯一的 `Name` 可以提升。那时用切片，循环调用每一件的金额，再乘各自的件数，或者每件自己带件数。本章的订单模型是一件商品加一个件数，所以嵌入成立。模型一旦变成购物车，就改切片，把这一章的提升留在单件商品的小票上。

接口仍由方法集决定。`Order` 提升了 `Item.Label` 之后，`Order` 也拥有 `Label` 方法，可以赋给要求 `Label() string` 的接口。外层再定义 `Label`，方法集里就是外层这份，内层那份不参与对外的方法集。实现接口时要看最终提升的结果，而不是只看自己写下的那几个方法。这是嵌入比继承更容易看漏的地方：你没写的方法也可能出现在类型上。保持内层方法少，外层的方法集才可读。

字面量嵌套时，漏写 `Item:` 这一层会直接失败。外层的字段名是 `Item`，类型也是 `Item`，两边同名容易看成重复，其实一个是字段，一个是类型。写成 `Order{Item: Item{Name: "tea", Cents: 1800}, Qty: 2}` 才完整。只写 `Order{Name: "tea"}` 在没有提升规则参与字面量的情况下并不成立：提升影响选择器，不影响字面量的字段列表。字面量必须按结构体自己的字段写，内层要有自己的字面量。这是新人最容易和提升搞混的一点。选择器可以写 `o.Name`，字面量不能假装 `Name` 是 `Order` 的顶层字段，除非你真的在外层声明了 `Name`。

复制订单时，内层商品一起走。把订单追加进切片，切片里存的是包含商品的整份值。之后修改切片外那个变量的单价，切片里的成交价不变。这和「嵌入只是视图」的误解相反。它是数据被包含。若你需要视图，嵌入指针，并接受共享和 nil。成交价用值，本章的 3600 才不会被后来的改价带动。

商品上的方法若改成指针接收者，值嵌入的 `Order` 仍然可以把可寻址的内层地址交出去，所以 `o.Label()` 在 `o` 是变量时往往还能调用。临时字面量则可能没有地址。为了让例子在解释器和编译器上一致，`Label` 保持值接收者，只读名称。需要改单价时，在 `Order` 上写指针接收者，显式改 `o.Cents`，不要依赖提升来的指针方法去改内层。改价是订单的动作，写在订单上，读的人找得到。

内层字段全是值类型时，外层的 `==` 仍然可用。两笔嵌入了同样茶、同样件数的订单相等。一旦内层放进切片或映射，整个订单就不再能用 `==`。比较要写成方法，按名称、单价、件数逐项看。本章的商品只有字符串和整数，相等判断留给语言自己的 `==` 即可。

包子同样嵌入 `Item`，单价 600，件数写在外层。`o.Cents * o.Qty` 用的是提升后的单价。四种包子是 2400。这个算式不需要把 `Item` 再赋给一个临时变量。临时变量只会让人以为商品被从订单上拆走了。提升的意义就是让这行算式留在订单上。

外层的 `Qty` 不会和外层的商品件数搞混，因为商品上根本没有 `Qty`。提升不会凭空造出件数。件数只写在订单上，这是嵌入边界清晰的地方。单价只写在商品上，订单通过提升去读。两边各有一个来源，算式 `o.Cents * o.Qty` 才同时用到两层。

## 小结

`Order` 嵌入 `Item` 之后，`o.Name` 和 `o.Cents` 提升到外层，方法也会提升。这是包含，复制时内层一起复制。外层同名字段或同名方法会挡住内层，内层要通过 `o.Item` 访问。没有父类调用。下一章用带缓冲的通道把一个确定的整数交回 `main`。

## 练习

嵌入商品，包子单价 600，件数 4。打印提升后的单价乘件数，应是 2400。

::: answer 参考答案：四只包子
```go run expect="2400" title="参考答案"
package main

import "fmt"

type Item struct {
	Cents int
}

type Order struct {
	Item
	Qty int
}

func main() {
	o := Order{Item: Item{Cents: 600}, Qty: 4}
	fmt.Println(o.Cents * o.Qty)
}
```
:::

外层和内层都有 `Name`。内层是 `bun`，外层是 `take`。打印外层名字和内层名字，中间空格。

::: answer 参考答案：两层名字
```go run expect="take bun" title="参考答案"
package main

import "fmt"

type Item struct {
	Name string
}

type Order struct {
	Item
	Name string
}

func main() {
	o := Order{Item: Item{Name: "bun"}, Name: "take"}
	fmt.Println(o.Name, o.Item.Name)
}
```
:::
