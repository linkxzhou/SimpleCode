---
language: go
chapter: 5
title: "件数不合法时把原因交回来"
level: intermediate
minutes: 28
goals:
  - "用多个返回值同时交回金额和 error"
  - "用 errors.New 和 fmt.Errorf 写出原因"
  - "在调用处判断 err 而不是忽略它"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

上一章的 `Cents` 总是返回一个整数。杯数若是 0 或者负数，乘法仍会给出 0 或负数，调用者分不清这是赠品、是算式，还是一张没填完的订单。这一章让计价函数返回两个结果：金额，以及一个 `error`。成功时金额是件数乘单价，`error` 是 nil。件数小于等于 0 时，金额返回 0，`error` 用 `errors.New` 带上原因。这一章不写 `defer`。离开函数时的清理放在下一章。

Go 没有把失败做成异常然后让它自动往上跳。失败是一个值，和金额并排出现在返回列表里。调用者必须在源码里面对它，要么检查，要么明确地丢掉。这种设计让订单的计价在阅读时能看见失败的去向。代价是每一层调用都多一行 `if err != nil`。行数变多，是为了不让失败变成只有运行到那一笔才出现的隐式跳转。

`charge` 接受件数和单价。件数不合法时，`errors.New("qty")` 造出一个实现了 `error` 接口的值。这个值来自标准库，不是我们自己声明的类型。自己声明一个带 `Error` 方法的类型，再放进 `error` 接口去调用，在 Yaegi 0.16 里会 panic。所以原因一律用 `errors.New` 或 `fmt.Errorf` 来造。两者都返回可以用的 `error`。`errors.New` 适合固定的短原因，比如件数。`fmt.Errorf` 适合把具体的数字嵌进句子，比如单价是负数时写出那个数字。

成功的路径先走一遍。两杯茶，单价 1800，返回 3600 和 nil。`main` 里若 `err != nil` 就打印原因并返回。成功则打印金额。输出是 3600。

```go run expect="3600" title="合法件数得到金额"
package main

import (
	"errors"
	"fmt"
)

func charge(qty, cents int) (int, error) {
	if qty <= 0 {
		return 0, errors.New("qty")
	}
	if cents < 0 {
		return 0, fmt.Errorf("price %d", cents)
	}
	return qty * cents, nil
}

func main() {
	n, err := charge(2, 1800)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Println(n)
}
```

`n, err := charge(...)` 使用短声明。两个名字在这一行同时出现，都是新的，所以 `:=` 合法。下一次若在同一块里再调用，`err` 已经存在，需要至少一个新名字才能再用 `:=`，否则改成 `=`。这是变量那一章的规则在错误处理里的日常形态。很多人把 `:=` 一直写下去，直到解释器说左边没有新变量。看到那句诊断，先找哪个名字其实早就有了。

失败的路径打印原因本身。件数 0，`charge` 返回 0 和 `errors.New("qty")`。`main` 看见 `err != nil`，打印 `err.Error()`，得到 `qty`。金额 0 不被打印。若你把次序写反，先打印 `n` 再看错误，终端里会出现一个 0，读起来像免费。检查放在使用金额之前。

```go run expect="qty" title="件数为零"
package main

import (
	"errors"
	"fmt"
)

func charge(qty, cents int) (int, error) {
	if qty <= 0 {
		return 0, errors.New("qty")
	}
	return qty * cents, nil
}

func main() {
	n, err := charge(0, 1800)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Println(n)
}
```

`fmt.Errorf` 用格式串组装原因。单价是负数时，`fmt.Errorf("price %d", cents)` 把数字放进文本。还可以用 `%w` 包住另一个错误：`fmt.Errorf("order: %w", errors.New("qty"))`。外层是给调用者看的上下文，内层是原来的原因。`errors.Unwrap` 能把内层取出来。下面这一块打印外层和内层。外层是 `order: qty`，内层是 `qty`。

```go run expect="order: qty" title="包一层上下文"
package main

import (
	"errors"
	"fmt"
)

func main() {
	err := fmt.Errorf("order: %w", errors.New("qty"))
	fmt.Println(err.Error())
	inner := errors.Unwrap(err)
	fmt.Println(inner.Error())
}
```

`%w` 和 `%v` 的差别在于能不能被 `Unwrap` 和 `errors.Is` 认出来。`%v` 只是把文本嵌进去，链条断了。订单若只是给人看一行日志，文本够用。订单若要在上层判断「是不是件数问题」，就保留链条，用 `%w` 包住 `errors.New("qty")`，上层用 `errors.Is(err, 某种哨兵)` 来认。这一章的哨兵直接是临时造出来的 `errors.New`，两次 `errors.New("qty")` 的指针不同，`errors.Is` 对不上。若要让 `Is` 好用，把 `var errQty = errors.New("qty")` 放在一处，所有返回都用这同一个值。文本相同不等于是同一个错误值。

忽略错误的写法是 `n, _ := charge(0, 1800)`。下划线把原因丢掉。金额仍是 0，程序继续，看起来像成功的免费订单。语言允许丢掉，是因为有些调用的错误在当前层确实无法处理，调用者准备用别的方式记录。在计价这里丢掉是不对的，因为 0 这个金额会继续参与求和，把一整天的账拉低。检查 `err` 是这一章的主路径。下划线留给「我读过签名，确定可以丢」的时刻，并且最好在旁边能看出你为什么可以丢。

多个返回值不只用于错误。映射的读取返回值和布尔，函数可以返回商和余数。`error` 只是其中一个常用的第二个类型。不要把布尔的失败和 `error` 混成一种。`ok == false` 表示键不在表里，这是正常的查询结果。`err != nil` 表示这一次操作没有完成约定。查一个不存在的商品，返回 0 和 false，调用者可以决定跳过。计价时件数非法，返回错误，调用者不应该把 0 加进营业额。

函数签名把错误放在最后一个返回值，这是整个标准库的习惯。`charge` 因此是 `(int, error)`，不是 `(error, int)`。习惯一致，调用处的 `n, err :=` 才读得顺。金额在前，是因为成功时你接下来要用的是金额。错误在后，是因为 `if err != nil` 形成一种固定的形状，眼睛可以扫描。

这一章每个可运行块都在 `err != nil` 时返回，不再往下打印金额。也可以把错误收集进切片，继续算下一笔。收集适合批量导入订单：一笔件数坏了，不该让后面的包子也不入账。立刻返回适合单笔计价：这一笔已经失败，没有「下一笔」。两种策略都合法。选择取决于函数的契约。契约若是「给出这一笔的钱」，失败就返回。契约若是「给一整张单子点出坏行」，就收集。可运行块用的是前者，所以输出里要么是金额，要么是原因，不会两样都有。

不要用 panic 代替 `error` 来报告件数非法。panic 适合程序自己的假设破了，比如下标越界、nil 映射写入。客人下了一单 0 杯，是输入问题，不是程序内部不一致。输入问题走返回值，调用者还在，可以换一笔重新计价。panic 会把调用栈拆掉，除非有人 `recover`，否则整次结账停住。上一章的 `recover` 用来展示 panic 的样子。计价不要靠那个机制来传递 `"qty"`。

[Go by Example](https://gobyexample.com/) 有错误处理的页。[Learn Go with Tests](https://quii.gitbook.io/learn-go-with-tests) 把错误当成需要断言的返回值。这里的断言就是终端里的 `3600` 或 `qty`。

错误文本是给人读的，稳定的身份才是给程序判断的。`"qty"` 这个字符串出现在终端里，是为了让这一章的期望可核对。程序若用 `err.Error() == "qty"` 来分支，以后有人把文本改成更完整的句子，分支就断了。用同一个 `errors.New` 的变量做哨兵，再用 `errors.Is`，文本可以改，身份还在。哨兵放在这份文件的顶部，`var errQty = errors.New("qty")`，`charge` 返回它，调用者 `errors.Is(err, errQty)`。这一章的可运行块直接打印文本，是因为块的目的就是看见原因，不是在原因上再写业务分支。

包装时不要丢掉原来的哨兵。`fmt.Errorf("order %s: %w", name, errQty)` 既有商品名，又保留 `errors.Is` 能认出的件数错误。茶和包子可以共用 `errQty`，外层文本把名字补上。这样柜台知道是哪一行，逻辑仍知道是件数问题。若每样商品都 `errors.New` 一个新值，`Is` 对不上，调用者只好去解析句子。解析句子是脆弱的。句子留给日志，身份留给判断。

多个调用串起来时，每一层都可能失败。先查单价，再 `charge`。查表失败和件数失败是两种 `error`。`main` 不必区分时，统一打印 `err.Error()` 并返回。需要区分时，再用 `errors.Is`。不要在每一层都 `fmt.Println` 然后继续返回，否则同一件失败会打两行，客人以为有两笔问题。打印放在最外层，内层只包装或原样返回。这一章的 `charge` 是最内层，`main` 是最外层，所以打印在 `main`。

成功时的 nil 必须是接口的 nil，而不是一个装着 nil 指针的自定义错误。我们没有自定义类型，`return nil` 就是真正的 nil，`err != nil` 为 false。这是坚持用 `errors.New` 的另一个好处：成功路径的 nil 不会被解释器或类型包装弄脏。调用者的判断保持那一行经典的形状。

把金额和错误的次序说成习惯之后，还要看 0 的位置。失败时返回 0，是因为签名要求必须有一个 `int`。0 不表示免费。免费应是 `qty` 为正、`cents` 为 0、`err` 为 nil。三者同时成立才是赠品。只有 0 没有 nil，是失败。只有 nil 没有正金额，要再看单价是不是真的为 0。调用者若图省事只看金额是否大于 0，会把赠品和失败都当成「不要入账」，账是平的，原因丢了。先看错误，再看金额。

`fmt.Errorf` 的格式串和 `Printf` 一样要和参数对上。`price %d` 配一个整数。配成 `%s` 会在真正编译时失败，解释器也可能在执行到那一行时才抱怨。把单价放进错误文本，是为了让负数十目了然，不是为了把所有字段都塞进一句话。件数已经由固定的 `qty` 表示，不必再格式化一次。文本越短，期望越好写，调用者也越不容易去依赖句子的后半段。

批量订单里，错误可以先收进一个切片再决定。`var failed []error`，循环里 `append`。nil 的错误切片可以 `append`，和整数切片一样。全部循环结束后，若 `len(failed)` 大于 0，就打印第一件或打印件数。这种收集让你看见一共坏了几笔。立即 `return` 让你只看见第一笔。小票场景用立即返回，导入场景用收集。两者都不要在 `err != nil` 时把返回的 0 加进营业额。收集用的切片装的是 `error` 值，这些值来自 `errors.New` 和 `fmt.Errorf`，不是来自自定义类型，因此可以放进 `[]error` 再打印 `Error()`，不会踩到解释器对自定义方法集的那个问题。

调用 `charge` 的人如果还要件数本身，件数应当作为输入留在调用者手里，不必从错误里再解析出来。错误回答「为什么没有金额」，不负责把全部输入再回传一遍。输入还在 `qty` 这个变量里。日志若要同时看见件数和原因，在打印处写成两段：先打印 `err.Error()`，需要的话再打印你自己的 `qty`。不要把这种拼接塞进 `charge` 的每一种失败里，让函数只负责判断。

单价为 0 且件数大于 0 时，`charge` 返回 0 和 nil。这是赠品，不是失败。终端里的 0 只有在你确认 `err` 为 nil 之后才表示赠品。练习和示例都用正的单价，避免把赠品和失败的 0 放在同一行输出里让人猜。真要演示赠品，就分两行打印：先打印 `ok`，再打印金额 0。

`errors.New` 每次调用都会得到一个新的值。同一段文字在两个块里各写一次，只是文本相同。块与块之间本来就不会共享变量。在同一份文件里若要判断身份，就把那个值放进一个变量，所有返回都用它。打印则只关心文本，所以两个块都写 `"qty"` 也能让期望命中。

## 小结

`charge` 返回金额和 `error`。件数不合法用 `errors.New`，需要嵌入数字或包住内层原因时用 `fmt.Errorf`。调用处先看 `err`，再使用金额。不自定义带 `Error` 方法的类型。下一章看 `defer` 在函数离开时按什么顺序运行。

## 练习

调用 `charge(2, 600)`，表示两个包子。成功时打印金额 1200。沿用这一章的判断结构。

::: answer 参考答案：两个包子
```go run expect="1200" title="参考答案"
package main

import (
	"errors"
	"fmt"
)

func charge(qty, cents int) (int, error) {
	if qty <= 0 {
		return 0, errors.New("qty")
	}
	return qty * cents, nil
}

func main() {
	n, err := charge(2, 600)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Println(n)
}
```
:::

单价写成 -1，件数 2。用 `fmt.Errorf("price %d", cents)` 返回错误。打印错误文本，其中要有 `price -1`。

::: answer 参考答案：单价为负
```go run expect="price -1" title="参考答案"
package main

import "fmt"

func charge(qty, cents int) (int, error) {
	if cents < 0 {
		return 0, fmt.Errorf("price %d", cents)
	}
	return qty * cents, nil
}

func main() {
	_, err := charge(2, -1)
	if err != nil {
		fmt.Println(err.Error())
	}
}
```
:::
