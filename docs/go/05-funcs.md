---
language: go
chapter: 5
title: "函数与闭包"
level: intermediate
minutes: 18
goals:
  - "返回多个结果"
  - "使用可变参数"
  - "用闭包记住状态"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

多返回值常用来同时给出结果和错误，下一章会专门讲错误。可变参数在函数内部是切片。

闭包可以改外层变量。计数器每次调用都让同一份 n 增加。

```go run expect="3 2" title="多返回值"
package main

import "fmt"

func divmod(a, b int) (int, int) {
	return a / b, a % b
}

func main() {
	q, r := divmod(17, 5)
	fmt.Println(q, r)
}
```

```go run expect="6" title="可变参数"
package main

import "fmt"

func sum(nums ...int) int {
	total := 0
	for _, n := range nums {
		total += n
	}
	return total
}

func main() {
	fmt.Println(sum(1, 2, 3))
}
```

```go run expect="1" title="计数器"
package main

import "fmt"

func counter() func() int {
	n := 0
	return func() int {
		n++
		return n
	}
}

func main() {
	next := counter()
	fmt.Println(next())
	fmt.Println(next())
}
```

函数可以返回多个值。调用处用 := 一次接住。常用来同时返回结果和 error，错误那一章会专门用。现在先练习返回商和余数这种都是正常结果的情况。

可变参数在函数里是切片。调用时写成 sum(1, 2, 3)。已经有切片时，用 sum(nums...) 拆开传进去。忘记三个点，会把整个切片当成一个参数，类型对不上。

闭包可以读写外层变量。计数器返回的函数每次把同一个 n 加一。这个函数值可以存进变量，传给别的函数。它带的状态在 main 结束前都还在。

命名返回值可以少写一次变量，但也会让 return 裸返回，读起来要回头看签名。教学例子把返回值写在 return 后面，签名保持干净。递归和闭包一起用时，先声明函数变量再赋值，否则函数字面量里还看不见自己的名字。

下划线可以丢掉一个返回值。err 不要随便丢。结果值如果后面不用，可以丢，并确认丢的不是错误。签名里越靠后的 error 越不应该用下划线。

可变参数不能再跟一个普通参数。它必须是最后一个。函数内部把它当切片用，可以 range，可以求 len。不要在内部再 append 后以为调用方的切片也变了，那是函数自己的一片。

闭包里的 n++ 改的是外层变量。把计数器返回值调用两次，应该看到 1 然后 2。如果两次都是 1，说明你在内部又声明了一个新的 n。

函数可以返回多个值。调用处用 := 一次接住。暂时不需要的那个用下划线丢掉，但 error 不要随便丢，丢掉之后旁边的结果往往是零值，程序会带着错的数继续。只有你能证明调用不可能失败时才丢，并且要清楚丢的是哪一个。

可变参数在函数里是切片。调用写成 fn(1, 2, 3)。已经有切片时，用 fn(nums...) 拆开。忘记三个点，会把整个切片当成一个参数，类型对不上。

闭包可以读写外层变量。返回的函数值带着那个变量，直到 main 结束。递归的函数若写在字面量里调用自己，要先声明函数变量再赋值，否则字面量里还看不见自己的名字。命名返回值可以少写变量，也会让裸 return 必须回头看签名。教学例子把返回值写在 return 后面。

多返回值都要在纸上写出各自的含义。商和余数不要写反。打印时两个值之间有空格，期望按这个空格来写。

### 读「多个结果」

先做这一例。代码收成一行是 `package main import "fmt" func div(a, b int) (int, int) { return a / b, a % b } func main() { q, r := div(17, 5) fmt.Println(q, r) }`。先盖住终端，用手算结果，纸上的文本里要能找到「3 2」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「3 2」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「拆开切片」

做完上一个再做这一例。代码收成一行是 `package main import "fmt" func addAll(nums ...int) int { sum := 0 for _, n := range nums { sum += n } return sum } func main() { fmt.Println(addAll([]int{1, 2, …`。先盖住终端，用手算结果，纸上的文本里要能找到「6」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「6」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：多返回值都接住，或明确用下划线丢掉你真的不需要的那个。 用「多个结果」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：差」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：把切片传给可变参数时加上 ...。 用「拆开切片」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：差」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：递归的函数变量先声明，再赋值。 用「多个结果」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：差」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：写一个接收两个 int 并返回它们差的函数，打印 10 和 3 的差。 做完再对照「参考答案：差」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：多返回值和可变参数是函数的两种常见形状。闭包记住外层变量，递归函数要先有名字才能调用自己。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```go run expect="3 2" title="多个结果"
package main

import "fmt"

func div(a, b int) (int, int) { return a / b, a % b }

func main() {
	q, r := div(17, 5)
	fmt.Println(q, r)
}
```

```go run expect="6" title="拆开切片"
package main

import "fmt"

func addAll(nums ...int) int {
	sum := 0
	for _, n := range nums {
		sum += n
	}
	return sum
}

func main() {
	fmt.Println(addAll([]int{1, 2, 3}...))
}
```

## 练习

用闭包做记忆化，计算 fib(8)。0,1,1,2,3,5,8,13,21 的第 8 项是 21。

::: answer 参考答案
```go run expect="21" title="参考答案"
package main

import "fmt"

func main() {
	mem := map[int]int{0: 0, 1: 1}
	var fib func(int) int
	fib = func(n int) int {
		if v, ok := mem[n]; ok {
			return v
		}
		mem[n] = fib(n-1) + fib(n-2)
		return mem[n]
	}
	fmt.Println(fib(8))
}
```
:::

写一个接收两个 int 并返回它们差的函数，打印 10 和 3 的差。

::: answer 参考答案：差
```go run expect="7" title="参考答案"
package main

import "fmt"

func diff(a, b int) int { return a - b }

func main() {
	fmt.Println(diff(10, 3))
}
```
:::

## 最佳实践

- 多返回值都接住，或明确用下划线丢掉你真的不需要的那个。
- 把切片传给可变参数时加上 ...。
- 递归的函数变量先声明，再赋值。

## 小结

多返回值和可变参数是函数的两种常见形状。闭包记住外层变量，递归函数要先有名字才能调用自己。

## 常见错误

- 可变参数再传给另一个可变参数时忘记用 ...。
- 闭包里的循环变量在旧版本会共享。这里的计数器不依赖循环变量。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
