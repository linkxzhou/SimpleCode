---
language: go
chapter: 6
title: "离开时按相反的顺序收尾"
level: intermediate
minutes: 26
goals:
  - "用三次 Print 得到 abc，看清 defer 的次序"
  - "让循环里注册的 defer 在函数末尾倒序执行"
  - "在注册时就把件数读进参数"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

上一章的 `charge` 在失败时立刻 `return`。返回之前若还要写一行收尾，比如记下「计价结束」，写在每一个 `return` 前面会重复，也会漏掉其中一处。`defer` 把收尾注册在函数开头附近，函数无论从哪一个 `return` 离开，注册过的调用都会运行。这一章仍用茶和包子的名字，金额先放下，把次序看清楚。

`defer` 后面跟一个函数调用。执行到 `defer` 这一行时，调用被压进一张属于当前函数的表，并不马上运行。当前函数准备返回时，表里的调用按后进先出运行：最后注册的最先运行。三行若是先注册 `c`，再注册 `b`，然后立刻打印 `a`，那么 `a` 先出现，返回时先跑 `b` 再跑 `c`。连在一起是 `abc`。

这里必须用 `fmt.Print`，不能用 `Println`。`Println` 会在每个字母后面加换行，终端里是三行，字母不再相邻，期望里的 `abc` 对不上。`Print` 只写参数本身。下面这一块的全部输出就是 `abc` 三个字符。

```go run expect="abc" title="后注册的先打印"
package main

import "fmt"

func main() {
	defer fmt.Print("c")
	defer fmt.Print("b")
	fmt.Print("a")
}
```

次序这样设计，是为了让资源的获取和释放写成对称的形状。先打开茶的账，`defer` 关闭茶；再打开包子的账，`defer` 关闭包子。函数离开时先关包子，再关茶，和打开的顺序相反。相反是有意义的：后获取的东西可能依赖先获取的东西，先释放依赖者，再释放被依赖者。若 `defer` 改成先进先出，释放顺序会和依赖关系拧着。语言选定后进先出，调用者用注册顺序表达「谁应该更晚结束」。

把两个名字放进循环，能看见同一条规则在多次注册下的样子。切片 `[]string{"tea", "bun"}` 的遍历次序是确定的，先茶后包子。每一轮先把 `name` 抄到新变量 `n`，再 `defer fmt.Print(n)`。循环结束后立刻 `fmt.Print("go")`。函数返回时，后注册的包子先打印，茶再打印。输出是 `gobuntea`。`go` 在前，因为它不是 defer，它在循环之后马上执行。`bun` 和 `tea` 在返回时倒序接上。抄到 `n` 是因为这个解释器若直接 `defer fmt.Print(name)`，会把 range 变量留到离开时再读，两轮都读到最后的 `bun`，输出变成 `gobunbun`。正式的语言规则是参数在注册时求值，每轮的名字应当被各自记住。新变量让抽屉和规格对齐。下标写法 `defer fmt.Print(names[0])` 也同样稳定，因为参数表达式不再依赖那个会被下一轮覆盖的循环变量。

```go run expect="gobuntea" title="循环里倒序"
package main

import "fmt"

func main() {
	for _, name := range []string{"tea", "bun"} {
		n := name
		defer fmt.Print(n)
	}
	fmt.Print("go")
}
```

循环里的 `defer` 要小心数量。十笔订单就注册十次，它们都要等到函数结束才运行。若函数是长时间不返回的循环本身，defer 会堆到函数真正结束。计价每一笔就想关闭的东西，应放在每一笔自己的函数里，让那个小函数返回，从而清空它自己的 defer 表。不要把一整天的订单都 defer 在 `main` 里。上面的循环只有两次，是为了让倒序能在一行里看完。

参数在注册的那一刻求值。这是语言的规则：`defer fmt.Println(hold(qty))` 会立刻调用 `hold(qty)`，把当时的整数存进这次延迟调用的参数，以后 `qty` 再变，存好的参数不变。返回时才执行 `fmt.Println`，打印的是当初存下的数。下面从 1 开始，注册时 `hold` 读到 1，然后把 `qty` 改成 2，先打印现在的 2，返回时再打印存下的 1。输出两行，先 2 后 1。

```go run expect="2\n1" title="注册时读走件数"
package main

import "fmt"

func hold(n int) int {
	return n
}

func main() {
	qty := 1
	defer fmt.Println(hold(qty))
	qty = 2
	fmt.Println(qty)
}
```

`hold` 看起来多此一举，只是把整数原样返回。它在这份课程里有一个具体的理由。Yaegi 0.16 对 `defer fmt.Println(qty)` 这种「直接把变量交给延迟调用」的写法，会在延迟执行时才去读变量，于是两行都变成 2。这和 Go 的规格不一致。规格要求参数在 `defer` 那一行就求值。把读取放进 `hold(qty)`，函数调用会立刻发生，解释器就会在注册时把 1 算出来，行为和规格对齐。课程用 `hold` 来演示这条规则。你在正式编译器上可以直接写 `defer fmt.Println(qty)`，得到的也是先 2 后 1。在这个抽屉里，请让读取发生在一个普通函数调用里，不要依赖解释器对裸变量的延迟读法。

延迟调用本身若改写了命名返回值，改写会发生在返回值交给调用者之前。那是一种少见的写法，用来在离开时统一修正结果。计价函数若采用它，读者要同时看 `return` 和 `defer` 才知道最终金额。这门课的金额只在 `return` 里决定，`defer` 只做打印这种收尾，避免两个地方一起改件数。

提前返回也会跑 defer。`finish` 在开头注册打印 `z`。参数为 false 时打印 `n` 然后 `return`。`z` 仍然出现，输出 `nz`。没有这条保证的话，每个失败分支都要记得打印收尾。有了它，失败分支只管 `return`。

```go run expect="nz" title="提前返回仍会收尾"
package main

import "fmt"

func finish(ok bool) {
	defer fmt.Print("z")
	if !ok {
		fmt.Print("n")
		return
	}
	fmt.Print("y")
}

func main() {
	finish(false)
}
```

`defer` 和 panic 也有关系。上一章说过，件数非法不要用 panic。若 panic 真的发生在这个函数里，已经注册的 defer 仍会在栈展开时运行，`recover` 也要写在 defer 里才接得住。映射那一章的 `recover` 就是这种形状。这一章的例子都不制造 panic，输出完全由 `Print` 的次序决定。

把 defer 用在订单上，可以想成：进入 `main` 时打印开始，defer 打印结束，中间调用 `charge`。无论 `charge` 返回错误还是金额，结束都会打印。注意 defer 里的打印若需要金额，金额必须在注册前就已经算好并交给一个函数参数。注册之后才算出来的金额，按规格不会自动跑进已经注册的参数。需要离开时看见最终金额，可以让 defer 调用一个闭包，闭包读取外面的变量。闭包读取的是变量本身，不是注册时的快照。这和 `hold` 的参数正好相反。参数是快照，闭包是当时的盒子。Yaegi 对闭包的读取比对裸参数更接近规格。若你要快照，用 `hold` 这种立刻执行的调用。若你要最终值，用闭包，并在这个解释器上先点一次 Run 核对输出。

闭包的写法这一章不放进可运行期望，是为了让 `abc`、`gobuntea` 和 `2` 再 `1` 三件事各自干净。混在一个 `main` 里，字母和数字会粘在一起，期望很难读。每一块只证明一件事。

[Go by Example](https://gobyexample.com/) 的 defer 页用文件关闭做例子。[Learn Go with Tests](https://quii.gitbook.io/learn-go-with-tests) 会在测试的清理里用到类似的离开动作。这里用字母和商品名把次序显出来，没有真的文件要关。

参数快照和闭包还可以放在订单的日志上想一遍。注册时写 `defer fmt.Print(hold(qty))`，记下的是当时的件数，后面加杯不会改这一行日志。注册时写 `defer func() { fmt.Print(qty) }()`，闭包在离开时读 `qty`，记下的是最终件数。两种都有用。开单日志要用快照，结账日志要用最终值。这一章的可运行块用 `hold` 演示快照，是因为解释器对裸变量的延迟读会把快照做坏。闭包在这个解释器上更接近「离开时再读」。你若把两者写进同一块，先点 Run 看次序，再决定期望。期望一旦和解释器的实际输出相反，教学就失效了。

`defer` 的调用若本身 panic，后面还没跑的 defer 仍会继续跑，然后恐慌继续向外。收尾函数要尽量简单。打印一个字母是简单的。在 defer 里再做一次可能失败的计价，失败会盖住原来的返回值，调用者看见的是收尾的恐慌而不是 `qty`。收尾不做业务判断。业务判断留在 `return` 之前的正常代码里。

循环外的注册次数是写死的，循环内的注册次数等于迭代次数。写死的三次 `Print` 得到 `abc`，最适合作为次序的标本，因为没有任何变量参与。标本里的字母是常量，解释器没有机会延后去读一个会变的名字。所以 `abc` 那一块是这一章的基准。循环那一块是在基准之上加了「每轮一个新变量」。基准不过，就不要先怀疑循环。

函数字面量上的 defer 属于那个字面量，不属于 `main`。你在 `go func(){ defer fmt.Print("c") }()` 里注册的调用，在该 goroutine 返回时运行，可能和 `main` 的打印抢次序。这一章不混进并发，字母的次序才唯一。并发那一章用通道交接整数，也不靠 defer 来排序打印。各章只让一种机制决定输出。

多个 defer 的参数各自独立求值。先 `defer fmt.Print(hold(1))` 再 `defer fmt.Print(hold(2))`，注册时就分别拿到 1 和 2，离开时先打印 2 再打印 1。数字是常量，没有变量可以延后读，解释器没有空子。订单若在 defer 里打印编号，编号也要在注册那一行就通过函数调用读走，尤其是编号存放在循环变量里的时候。常量字母 `a`、`b`、`c` 是最干净的教材，因为它们没有身份会变。

`defer` 不能写在函数体外，也不能用 `go defer` 这种不存在的组合。它只属于某一个函数的某一次调用。递归的计价函数每一层都有自己的 defer 表，层数深，表就多。订单合计不需要递归。一层循环加一张 defer 表就够。若你为了练习写成递归，先保证递归会停，再谈离开时的打印次序。每一层的 defer 在该层返回时运行，所以最深的一层先收尾。这和循环里后注册的先运行是同一条后进先出，只是表分成了多层。这一章不把递归放进可运行块，避免输出变成一长串难核对的字母。

离开 `main` 时，已经打印的 `abc` 不会因为进程退出而丢失。这三个字母是在返回过程中写到标准输出的，写完才真正结束。不必再加刷新。若改用缓冲很重的输出并且进程被杀掉，那是另一回事。正常返回的 defer 会把 `Print` 做完。

`Print` 和 `Println` 的差别只在换行。字母教材选 `Print`，是为了让 `abc` 成为连续的三个字符。金额教材可以继续用 `Println`，因为数字各自占一行更清楚。不要在 `abc` 那一块里混进 `Println`，否则行尾的换行会把字母拆开。

注册 defer 的那一行如果写错成普通调用，字母会立刻出现，次序就变成注册次序而不是离开次序。`abc` 这块里，`c` 和 `b` 都带着 `defer`，`a` 不带。少写一个 `defer`，输出会从 `abc` 变成别的排列。对期望时先数有几个 `defer`。

## 小结

`defer` 在函数离开时运行，后注册的先运行。`defer fmt.Print("c")`、`defer fmt.Print("b")`、再 `fmt.Print("a")`，输出是 `abc`。循环里的注册也倒序。参数应在注册时求值；在这个解释器里用一个普通函数把件数读走，才能稳定看到当初的 1。下一章回到零值，看一张什么都没填的订单为什么仍然能用。

## 练习

只注册两个 defer，先 `b` 后 `a`，函数体里不再有其他打印。按后进先出，输出应是 `ab`。用 `fmt.Print`。

::: answer 参考答案：两个字母
```go run expect="ab" title="参考答案"
package main

import "fmt"

func main() {
	defer fmt.Print("b")
	defer fmt.Print("a")
}
```
:::

先注册包子再注册茶，用下标而不是循环变量：`defer fmt.Print(names[0])` 注册 `bun`，`defer fmt.Print(names[1])` 注册 `tea`。离开时先茶后包子，输出 `teabun`。不要在循环里直接打印 range 变量。

::: answer 参考答案：倒序商品名
```go run expect="teabun" title="参考答案"
package main

import "fmt"

func main() {
	names := []string{"bun", "tea"}
	defer fmt.Print(names[0])
	defer fmt.Print(names[1])
}
```
:::
