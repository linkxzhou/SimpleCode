---
language: go
chapter: 4
title: "数组、切片与 map"
level: beginner
minutes: 18
goals:
  - "区分数组和切片"
  - "用 append 生长切片"
  - "用 map 统计词频"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

数组长度是类型的一部分。切片是数组的窗口，`append` 可能换一块底层存储。map 的键必须能比较。

读一行输入用 `bufio.Scanner`。示例把样例输入交给标准输入。

```go run stdin="to be or not to be\n" expect="2" title="词频"
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	in := bufio.NewScanner(os.Stdin)
	in.Scan()
	counts := map[string]int{}
	for _, word := range strings.Fields(in.Text()) {
		counts[word]++
	}
	fmt.Println(counts["to"])
}
```

```go run expect="[1 2 3]" title="去重保序"
package main

import "fmt"

func main() {
	nums := []int{1, 2, 2, 3}
	seen := map[int]bool{}
	var out []int
	for _, n := range nums {
		if !seen[n] {
			seen[n] = true
			out = append(out, n)
		}
	}
	fmt.Println(out)
}
```

```go run expect="2 3" title="切片窗口"
package main

import "fmt"

func main() {
	a := [3]int{7, 8, 9}
	s := a[:2]
	fmt.Println(len(s), cap(a))
}
```

数组的长度是类型的一部分。[3]int 和 [4]int 是不同类型。切片是数组上的窗口，长度是当前元素个数，容量是到底层数组末尾还能放多少。append 在容量够时原地加，不够时分配新数组，旧切片可能仍指向旧数组。不要保存 append 之前的切片指针当唯一真相，接住 append 的返回值。

切片字面量和数组字面量差在长度写不写。[]int{1, 2} 是切片，[2]int{1, 2} 是数组。函数参数几乎总是用切片，这样调用方可以传任意长度。

map 的键必须能比较。读取不存在的键得到零值，不会 panic。要用第二个返回值才能知道键在不在。nil map 可以读，不能写，写会 panic。先 make 或用字面量。

range 的顺序对切片是下标顺序，对 map 不稳定。要稳定输出就收集键、排序、再取值。本章若打印 map 本身，用某个确定的键，不打印整个 map。

append 可能让旧切片和新切片不再共享底层数组。如果你把切片传给函数，函数里 append 之后没有返回新切片，调用方可能看不到新元素。需要增长就返回新切片，或者传入指针。本章的例子在 main 里接住返回值，避免这个偏差。

nil 切片的 len 是 0，range 它什么都不做，append 它可以得到非 nil 切片。这很方便。nil map 则不能写。两种 nil 的规则不同，不要互相类推。

打印切片用 fmt.Println 会得到带方括号的格式，元素之间有空格。期望子串可以写 [1 2 3]。不要写成带逗号的 JSON，那不是 Go 的默认格式。

数组的长度是类型的一部分。[3]int 和 [4]int 是不同类型。切片是对数组的窗口，长度可以变。append 可能换一块新的底层数组，所以必须接住返回值。写成 s = append(s, x)。不接住的话，函数里的增长调用方可能看不见。把切片传给函数时，若函数里会 append，就把新切片返回来。

切片的 len 是当前元素个数，cap 是底层还能用多少。教学打印 len 就够。切片表达式的右端不包含。越界的下标会 panic，切片表达式越界同样会 panic，这和 Python 的切片不同，不要写成「多切一点没关系」。

map 的缺失键返回零值，并用第二个布尔说明在不在。只看值是 0，无法区分「没有这个键」和「值就是 0」。写入之前 map 必须用 make 或字面量创建。向 nil map 写入会 panic。range map 的顺序不稳定，测试打印某个键的值或元素个数，不要把某一次的遍历文本写进期望。

删除用 delete。删除不存在的键是空操作，不会 panic。

### 读「接住 append」

先做这一例。代码收成一行是 `package main import "fmt" func main() { s := []int{1} s = append(s, 2, 3) fmt.Println(len(s)) }`。先盖住终端，用手算结果，纸上的文本里要能找到「3」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「3」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「键不存在」

做完上一个再做这一例。代码收成一行是 `package main import "fmt" func main() { m := map[string]int{"a": 1} v, ok := m["b"] fmt.Println(v, ok) }`。先盖住终端，用手算结果，纸上的文本里要能找到「0 false」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「0 false」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：append 的返回值赋回去，不要假定原切片变量已经变长。 用「接住 append」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：第一个元素」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：写 map 之前先 make，读的时候用 ok 区分缺失和零值。 用「键不存在」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：第一个元素」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：需要稳定顺序时排序键，不依赖 range map 的顺序。 用「接住 append」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：第一个元素」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：创建一个长度为 0 的切片，append 一个 7，打印这个元素。 做完再对照「参考答案：第一个元素」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：数组长度属于类型，切片是窗口，append 可能换底层数组。map 的缺失键给出零值，写入前必须先创建。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```go run expect="3" title="接住 append"
package main

import "fmt"

func main() {
	s := []int{1}
	s = append(s, 2, 3)
	fmt.Println(len(s))
}
```

```go run expect="0 false" title="键不存在"
package main

import "fmt"

func main() {
	m := map[string]int{"a": 1}
	v, ok := m["b"]
	fmt.Println(v, ok)
}
```

## 练习

append 两次，打印切片长度。

::: answer 参考答案
```go run expect="2" title="参考答案"
package main

import "fmt"

func main() {
	var s []int
	s = append(s, 1, 2)
	fmt.Println(len(s))
}
```
:::

创建一个长度为 0 的切片，append 一个 7，打印这个元素。

::: answer 参考答案：第一个元素
```go run expect="7" title="参考答案"
package main

import "fmt"

func main() {
	var s []int
	s = append(s, 7)
	fmt.Println(s[0])
}
```
:::

## 最佳实践

- append 的返回值赋回去，不要假定原切片变量已经变长。
- 写 map 之前先 make，读的时候用 ok 区分缺失和零值。
- 需要稳定顺序时排序键，不依赖 range map 的顺序。

## 小结

数组长度属于类型，切片是窗口，append 可能换底层数组。map 的缺失键给出零值，写入前必须先创建。

## 常见错误

- 把切片当成永远指向原数组。append 超出容量时会换新数组。
- range map 的顺序当成稳定的。要稳定输出就收集键再排序。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
