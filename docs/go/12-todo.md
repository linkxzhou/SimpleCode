---
language: go
chapter: 12
title: "小项目：命令行待办"
level: advanced
minutes: 18
goals:
  - "用结构体保存一条待办"
  - "从标准输入接收命令"
  - "把清单只放在内存里"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

待办事项用切片保存。命令 `add 文字` 追加一条，`list` 打印全部。程序读到 EOF 就结束，清单不写入磁盘。

示例一次喂入两行命令。

```go run stdin="add 买笔\nlist\n" expect="买笔" title="待办"
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type item struct{ title string }

func main() {
	var items []item
	in := bufio.NewScanner(os.Stdin)
	for in.Scan() {
		fields := strings.SplitN(in.Text(), " ", 2)
		switch fields[0] {
		case "add":
			items = append(items, item{title: fields[1]})
		case "list":
			fmt.Println(len(items))
		}
	}
	fmt.Println(items[0].title)
}
```

```go run expect="2" title="完成数"
package main

import "fmt"

func doneCount(flags []bool) int {
	n := 0
	for _, ok := range flags {
		if ok {
			n++
		}
	}
	return n
}

func main() {
	fmt.Println(doneCount([]bool{true, false, true}))
}
```

::: note
想跨次运行保存清单，需要本环境之外的文件系统。刷新页面后内存清单会消失。
:::

待办清单放在切片里，元素是结构体或字符串。命令从标准输入按行进来。add 后面的文字是标题，list 打印数量或每条标题。读到 EOF 就结束，文档运行会在样例输入末尾送上 EOF。

拆行用 strings.SplitN(line, " ", 2)，这样标题里的空格能保留。结果可能只有一段，访问第二段之前看长度。空行跳过。未知命令打印固定的短句，不用 panic。

状态放在 main 的局部变量里。不要放进函数的全局变量就以为下次 Run 还在。进程结束内存就没了，这是环境的限制。同一次运行里可以先 add 再 list，样例输入用换行把两条命令接上。

先写不读输入的函数，例如数已完成的条数，再写循环。函数好检查，循环只负责读写。输出格式固定：第一行数量，后面每行一个标题，或者只打印你真正要断言的那一项。

样例输入是多行文本，最后一行也可以没有额外的空行，扫描器会读到 EOF。命令和正文之间只用一个空格分隔。用户如果打了两个空格，SplitN 仍把余下全部当作正文，正文开头会多一个空格。教学例子避免双空格。

list 可以打印条数，也可以打印每条标题。打印条数更适合做期望子串，因为标题可能重复。完整示例里两种都出现过，新增的例子保持只打印一个确定的数或一个确定的标题。

不要把清单放进 init 函数或包级变量后认为它是「数据库」。下一次点击 Run 会重新解释这份源码，包级变量也会重新是空的。持久化不在本环境的能力里。

待办清单放在切片里。命令按行处理。add 后面的文字是标题，list 打印数量或每条标题。拆行用 SplitN(line, " ", 2)，标题里的空格才能保留。结果可能只有一段，访问第二段之前看长度。空行跳过。未知命令打印固定的短句，不用 panic。

状态放在 main 的局部变量里。进程结束内存就没了，下一次 Run 不会看见上一次的清单。同一次运行里可以先 add 再 list，样例输入用换行把命令接上。读到输入结束就停，文档运行会在样例末尾送上结束符。不要写死循环去等一个永远不来的命令。

先写不读输入的函数，例如数有多少条非空命令，或从一个已经拆好的切片里取出标题。函数好检查。循环只负责读写。输出格式固定：要么只打印数量，要么每行一个标题。格式里的空格要和期望一致。

用户如果打了两个空格，SplitN 仍把余下全部当作正文，正文开头会多一个空格。教学例子避免双空格。命令和标题都用具体的字，例如「买笔」，期望就写这个词，而不是写整段调试输出。

### 读「跳过空命令」

先做这一例。代码收成一行是 `package main import "fmt" func main() { lines := []string{"add a", "", "add b"} n := 0 for _, line := range lines { if len(line) > 0 { n++ } } fmt.Println(n) }`。先盖住终端，用手算结果，纸上的文本里要能找到「2」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「2」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「只留标题」

做完上一个再做这一例。代码收成一行是 `package main import ( "fmt" "strings" ) func main() { parts := strings.SplitN("add 买笔", " ", 2) fmt.Println(parts[1]) }`。先盖住终端，用手算结果，纸上的文本里要能找到「买笔」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「买笔」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：用 SplitN 限制成两段，保留标题里的空格。 用「跳过空命令」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：两条」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：访问命令正文之前检查字段个数。 用「只留标题」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：两条」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：清单只活在这一次进程里，不要假设下次运行还在。 用「跳过空命令」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：两条」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：直接 append 两条标题，打印切片长度。 做完再对照「参考答案：两条」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：命令行待办是一次运行内的切片加按行循环。拆分命令要防越界，输出格式要稳定。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```go run expect="2" title="跳过空命令"
package main

import "fmt"

func main() {
	lines := []string{"add a", "", "add b"}
	n := 0
	for _, line := range lines {
		if len(line) > 0 {
			n++
		}
	}
	fmt.Println(n)
}
```

```go run expect="买笔" title="只留标题"
package main

import (
	"fmt"
	"strings"
)

func main() {
	parts := strings.SplitN("add 买笔", " ", 2)
	fmt.Println(parts[1])
}
```

## 练习

只执行 `add 书`，打印条数 1。可以不读输入，直接 append。

::: answer 参考答案
```go run expect="1" title="参考答案"
package main

import "fmt"

func main() {
	items := []string{}
	items = append(items, "书")
	fmt.Println(len(items))
}
```
:::

直接 append 两条标题，打印切片长度。

::: answer 参考答案：两条
```go run expect="2" title="参考答案"
package main

import "fmt"

func main() {
	items := []string{}
	items = append(items, "书", "笔")
	fmt.Println(len(items))
}
```
:::

## 最佳实践

- 用 SplitN 限制成两段，保留标题里的空格。
- 访问命令正文之前检查字段个数。
- 清单只活在这一次进程里，不要假设下次运行还在。

## 小结

命令行待办是一次运行内的切片加按行循环。拆分命令要防越界，输出格式要稳定。

## 常见错误

- SplitN 的结果只有命令、没有正文时访问 fields[1]。先检查长度。
- 把清单存进全局变量就以为下次运行还在。进程一结束就没了。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
