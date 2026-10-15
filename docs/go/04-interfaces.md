---
language: go
chapter: 4
title: "只要能报出这一笔的金额"
level: intermediate
minutes: 28
goals:
  - "在同一个文件里声明一个小接口"
  - "让茶和包子各自实现金额方法"
  - "用类型选择分清接口里具体是哪一种"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

上一章的单价表用商品名查整数。柜台还想对「任何能报出金额的东西」求和，而不关心它是茶还是包子。这一章在同一个文件里声明一个小接口 `Priced`，只要求一个方法 `Cents() int`。茶和包子用两个结构体实现它。接口的方法集里没有 `Error`。失败和错误值是下一章的事，这一章的接口只谈金额。

接口是一组方法签名。`Priced` 写出来只有 `Cents`。谁拥有这个方法，谁就可以放进 `Priced` 变量。Go 的实现是隐式的：茶的结构体不必写「我实现了 Priced」。方法对得上，赋值就能通过。隐式的好处是标准库里的接口可以由你的类型去满足，你的类型也可以被后来才写的接口接纳，两边不必互相导入一句声明。代价是读代码时，「这个类型到底满足哪些接口」不会写在类型旁边。小接口把这个问题缩小。一个方法的接口，搜索方法名就能找到实现。十个方法的接口，实现者要一次凑齐，测试也要一次凑齐，柜台的金额却只用到其中一个。所以这一章把接口收成「报出金额」这一件事。

茶的金额是杯数乘 1800。包子的金额是个数乘 600。两个类型的字段名可以不同，`Cups` 和 `Count` 各说各的单位。接口不关心字段，只关心方法返回的整数。`Bill` 接受 `Priced`，调用 `Cents`，把结果返回。`main` 里把两杯茶交给 `Bill`。输出 3600。

```go run expect="3600" title="两杯茶的接口"
package main

import "fmt"

type Priced interface {
	Cents() int
}

type Tea struct {
	Cups int
}

func (t Tea) Cents() int {
	return t.Cups * 1800
}

func Bill(p Priced) int {
	return p.Cents()
}

func main() {
	fmt.Println(Bill(Tea{Cups: 2}))
}
```

`Bill` 的参数类型是接口，不是 `Tea`。函数体里不能访问 `Cups`，因为 `Priced` 没有这个字段。这是接口的约束在起作用：计算路径只能依赖约定好的方法。若 `Bill` 需要杯数，说明这个函数其实知道自己在卖茶，那它应该接受 `Tea`，而不是接受接口。接口适合「多种东西都能做的那一小段」。茶和包子都能报金额，所以求和走接口。打印杯数只属于茶，留在 `Tea` 的方法里。

第二种实现放进切片。切片的元素类型写成 `Priced`，里面可以同时放 `Tea` 和 `Bun`。循环调用 `Cents`，加总。两杯茶 3600，三个包子 1800，合计 5400。每个具体值在放进接口时都会带上自己的类型信息。循环里的 `p` 是接口值，方法调用会找到当初放进去的那个具体方法。茶的 `Cents` 和包子的 `Cents` 不会混用。

```go run expect="5400" title="茶和包子一起求和"
package main

import "fmt"

type Priced interface {
	Cents() int
}

type Tea struct {
	Cups int
}

func (t Tea) Cents() int {
	return t.Cups * 1800
}

type Bun struct {
	Count int
}

func (b Bun) Cents() int {
	return b.Count * 600
}

func main() {
	items := []Priced{
		Tea{Cups: 2},
		Bun{Count: 3},
	}
	sum := 0
	for _, p := range items {
		sum += p.Cents()
	}
	fmt.Println(sum)
}
```

接口值里面其实有两样东西：具体类型，以及那个具体值的副本。把 `Tea` 放进 `Priced` 时，茶被复制进接口。之后改原来的 `Tea` 变量，接口里的副本不变。这和结构体赋值是同一条规则。若方法是指针接收者，放进接口的就应该是指针，这样方法改的是同一笔。值接收者的 `Cents` 只读字段，复制一份是安全的。金额方法保持值接收者，避免「求和的时候把杯数改了」。

有时求和之后还想知道这一项是茶还是包子，比如分别记账。接口本身把具体类型藏起来了，断言再把它打开。`t, ok := p.(Tea)` 在动态类型确是茶时让 `ok` 为 true，`t` 回到 `Tea`，杯数可以读。包子那一项 `ok` 为 false，不打印。切片里先放一个包子再放两杯茶，终端里只留下数字 2。类型选择 `switch v := p.(type)` 是同一件事的多分支写法，每个分支里的 `v` 类型不同。这一块用断言，是因为空的 `case` 在这个解释器里会让循环中的选择什么都不输出。正式编译器允许空分支表示忽略。抽屉里的可运行例子让每个要观察的类型都走到一条打印。

```go run expect="2" title="断言回到茶"
package main

import "fmt"

type Priced interface {
	Cents() int
}

type Tea struct {
	Cups int
}

func (t Tea) Cents() int {
	return t.Cups * 1800
}

type Bun struct {
	Count int
}

func (b Bun) Cents() int {
	return b.Count * 600
}

func main() {
	items := []Priced{
		Bun{Count: 1},
		Tea{Cups: 2},
	}
	for _, p := range items {
		t, ok := p.(Tea)
		if ok {
			fmt.Println(t.Cups)
		}
	}
}
```

类型选择是接口的逃生口。用得越多，说明接口太宽或者调用者太知道具体类型。若每个调用者都要 `switch` 成茶和包子，接口就没有帮你隐藏差异，只是多包了一层。金额求和不需要 `switch`，上一块已经证明。只有「金额之外的行为」才需要回到具体类型。也可以给接口再加一个方法，比如 `Kind() string`。加方法会迫使每个实现都提供种类，调用者不必 `switch`。代价是接口变大，只想复用金额的测试替身也得多写一个方法。种类只在一两处需要时，类型选择或断言更局部。种类到处都要时，把它放进接口。逗号 ok 的失败分支要写出来。只写 `t := p.(Tea)` 会在包子上 panic，整张单子停在一次错误的断言上。`ok` 把「这不是茶」变成普通的假，循环还能走向下一项。

空接口 `any` 几乎什么都能装。它没有方法，所以不能调用 `Cents`。把订单放进 `any` 再取出来，还是要类型断言。柜台的求和若接受 `any`，函数体里会堆满断言，编译器也帮不上「你是不是忘了金额方法」。`Priced` 把这个检查提前到赋值的那一行。少一个方法，赋值就失败，失败发生在解释这一份文件的时候，而不是发生在客人结账的时候。

指针接收者会改变方法集。若 `Cents` 写在 `*Tea` 上，那么 `Tea` 的值不包含这个方法，`*Tea` 才包含。正式的编译器会拒绝把 `Tea` 值赋给 `Priced`。这个解释器对这种赋值偶尔比编译器松，松了之后调用可能看起来能跑，换到 `go build` 又失败。课程的金额方法一律写在值接收者上，调用时传值。这样抽屉和编译器看见的是同一份方法集。需要修改杯数时，另写一个指针接收者的方法，不要让那个方法成为 `Priced` 的一部分。

接口值自己的零值是 nil。`var p Priced` 之后调用 `p.Cents()` 会 panic，因为没有具体类型可调用。这和「具体值是 nil 指针」还不一样。一个持有 `(*Tea)(nil)` 的接口，动态类型不是 nil，动态值是 nil。调用值接收者时，nil 指针会被复制，方法若只返回常数还能活；方法若访问字段就会炸。金额方法访问 `Cups`，因此不要把 nil 指针放进 `Priced`。切片里只放已经填好杯数或个数的值。

这一章没有定义 `Error() string`，也没有自定义错误类型。Yaegi 0.16 在通过接口值调用你自己写的 `Error` 方法时会 panic，那是解释器的缺陷，不是 `error` 接口的设计。标准库的 `errors.New` 可以正常使用，下一章走那条路。金额接口避开 `Error` 这个名字，方法叫 `Cents`，返回整数。这样既讲清小接口，也不踩解释器的那个坑。

[Go by Example](https://gobyexample.com/) 的接口页用几何图形做例子。[Learn Go with Tests](https://quii.gitbook.io/learn-go-with-tests) 强调小接口和显式依赖。这里的依赖是 `Priced`，图形换成了茶和包子。

接口值的比较也有限制。若动态类型是不可比较的，比如切片，两个接口值用 `==` 会 panic。茶和包子的结构体只含整数，可以比较。把它们放进 `Priced` 之后，比较的是动态类型加上动态值。两杯同样的茶，放进接口后相等。一个茶和一个包子，类型不同，不相等。不要用接口相等来判断「是不是同一张柜台单」。那需要指针身份或订单号。金额接口只保证能算出整数。

测试替身是小接口的实际好处。`Bill` 接受 `Priced`，测试可以写一个 `type Fixed struct{ n int }`，方法返回固定的 `n`，不必真的准备茶。生产代码用 `Tea` 和 `Bun`，测试用 `Fixed`。两边都不用修改 `Bill`。若 `Bill` 写成只接受 `Tea`，测试就得构造杯数再乘 1800，测到的是茶的公式而不是「求和会调用 Cents」。接口把这个缝留出来。缝留得太大，替身要实现一堆无关方法。一个方法的 `Priced` 让替身只有一行。

把接口定义在使用它的一边，而不是定义在茶的文件里。这一份文件里两边在一起，看不出差别。真到多文件时，`Bill` 所在的包声明 `Priced`，茶的包不必知道这个接口的名字。隐式实现让茶只提供 `Cents`。这避免了商品包去导入结账包，从而绕开循环导入。抽屉里写不成两个包，道理可以先放在心里：接口是调用方的需求清单，不是实现方的标签。

nil 接口和「装着 nil 指针的接口」在 `== nil` 上结果不同。`var p Priced` 与 nil 相等。`var t *Tea; var p Priced = t` 与 nil 不相等，因为动态类型已经是 `*Tea`。打印、判断、调用都会分岔。金额路径不把指针放进接口，这条分岔就不会出现在结账里。若将来必须用指针接收者满足接口，判断「有没有商品」要在放进接口之前做完，不要等接口自己等于 nil。

方法集只看方法，不看字段。茶有 `Cups`，包子有 `Count`，接口两边都看不见。若你希望小票打印单位，要么给接口加 `Unit() string`，要么在断言回到具体类型之后再读字段。加方法让所有实现一起改。断言让打印逻辑集中在一处，具体类型一多，这处就会变长。两样商品时，断言或类型选择都还能读完。商品增加到十样，优先加方法，让每种商品自己知道单位，循环里只调用方法。十个 `case` 是另一份需要同步维护的清单，漏一个就进了 `default`。

接口也可以由别的接口组合而成。`type Priced interface { Cents() int }` 再嵌进一个更大的接口里，大接口同时要求金额和名称。组合接口是声明时的嵌入，和结构体嵌入不是一回事，但都是在避免复制一份签名。这一章保持一个方法，是因为名称可以直接留在具体类型上。等小票函数真的只拿到接口、又必须打印名称时，再把 `Name() string` 加进去。加之前先确认每个实现都能给出名称，空串也算给出。不要在加方法的同时改变金额的单位。金额一直是分，名称一直是字符串，两者不要塞进同一个返回值里用格式拼起来，否则调用者还得把数字解析回去。

`Bill` 只做转发，看起来像多余的一层。留着它，是为了让「只依赖接口」这件事出现在一个有名字的函数上。把 `Cents` 的调用散落在 `main` 里，每一处都直接拿着接口，规则仍在，只是没有一个地方集中展示。两杯茶的 3600 从 `Bill` 出来，读的人知道这 3600 不是 `main` 自己乘的，是接口方法乘的。

## 小结

`Priced` 只要求 `Cents() int`。茶和包子各自实现，切片里可以混放，`Bill` 和循环只调用这个方法。类型选择在确实需要具体字段时再打开接口。不要把自定义的 `Error` 方法放进接口值去调用。下一章用多个返回值交回金额和失败原因。

## 练习

写 `Bun` 的 `Cents`，三个包子。用 `Bill` 或直接调用，打印 1800。

::: answer 参考答案：三个包子
```go run expect="1800" title="参考答案"
package main

import "fmt"

type Priced interface {
	Cents() int
}

type Bun struct {
	Count int
}

func (b Bun) Cents() int {
	return b.Count * 600
}

func main() {
	var p Priced = Bun{Count: 3}
	fmt.Println(p.Cents())
}
```
:::

切片里放一杯茶和两个包子。茶 1800，包子 1200。打印合计 3000。

::: answer 参考答案：一杯加两个
```go run expect="3000" title="参考答案"
package main

import "fmt"

type Priced interface {
	Cents() int
}

type Tea struct {
	Cups int
}

func (t Tea) Cents() int {
	return t.Cups * 1800
}

type Bun struct {
	Count int
}

func (b Bun) Cents() int {
	return b.Count * 600
}

func main() {
	items := []Priced{Tea{Cups: 1}, Bun{Count: 2}}
	sum := 0
	for _, p := range items {
		sum += p.Cents()
	}
	fmt.Println(sum)
}
```
:::
