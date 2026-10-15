---
language: go
chapter: 11
title: "标准库精选"
level: advanced
minutes: 18
goals:
  - "用 strings 和 sort"
  - "用 time.Date 而不是 Sleep"
  - "用 encoding/json 编解码"
sources:
  - gobyexample
  - learn-go-tests
updated: "2026-10-15"
---

`strings`、`sort`、`strconv` 和 `encoding/json` 覆盖了大部分小工具。`time.Date` 构造一个确定的时刻，不需要让程序真的睡下去。

JSON 的字段名由结构体标签决定。标签要用反引号。

```go run expect="GO" title="strings"
package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println(strings.ToUpper("go"))
	fmt.Println(strings.Count("banana", "a"))
}
```

```go run expect="1 3" title="排序"
package main

import (
	"fmt"
	"sort"
)

func main() {
	nums := []int{3, 1, 2}
	sort.Ints(nums)
	fmt.Println(nums[0], nums[2])
}
```

```go run expect="2026" title="时间和 JSON"
package main

import (
	"encoding/json"
	"fmt"
	"time"
)

type Item struct {
	Name string `json:"name"`
}

func main() {
	t := time.Date(2026, 10, 15, 0, 0, 0, 0, time.UTC)
	b, err := json.Marshal(Item{Name: "笔"})
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(t.Year())
	fmt.Println(string(b))
}
```

strings 处理文本：ToUpper、Contains、Count、Fields、TrimSpace。Fields 按空白切开，比自己找空格稳。sort 对切片原地排序，Ints 专门排 int。排序之后再取第一个和最后一个，就不用打印整个切片。

time.Date 构造一个确定的时刻。不要用 time.Sleep 制造等待，这里不保证真实睡眠，并发那一章已经说过。Year、Month、Day 足够做日历题。时区用 time.UTC，避免本地时区让日期差一天。

encoding/json 靠结构体标签决定字段名。标签是反引号里的 json:"name"。字段必须大写才能被编码。小写字段即使有标签也不会导出。Unmarshal 要传入指针，否则改的是副本。

strconv 在错误那一章已经用过 Atoi。这里可以搭配 strings 做小工具：先 TrimSpace 再 Atoi。组合标准库，而不是自己写解析器。

结构体标签的反引号是 Go 的原始字符串，里面可以有双引号。JSON 名字通常用小写，和字段的导出大写名字不同。忘记标签时，编码用的是字段名本身，解码时大小写要匹配，否则得到零值。

sort.Ints 会改切片。如果这个切片还要按原顺序打印，先复制一份再排序。复制用 append([]int(nil), nums...)。本章例子排序后只读端点，不再需要原顺序。

time.Date 的月份是 time.October 或数字 10。数字更短，但要确认参数顺序是年、月、日。写反了会得到另一个合法日期，程序不报错，只是差很多天。

strings 处理文本。Fields 按空白切开，比自己找空格稳。ToUpper、Contains、TrimSpace 都不改原字符串，它们返回新字符串。sort.Ints 对切片原地排序。若调用方还要原来的顺序，先复制再排。排完取第一个和最后一个，就不必打印整个切片，期望也更短。

time.Date 构造一个确定的时刻。不要用 Sleep。时区用 UTC，避免本地时区让日期差一天。Year、Month、Day 足够做日历题。打印数字而不是打印 Time 的默认文本，默认文本很长，不适合当子串以外的精确比对。

encoding/json 靠导出字段和标签。标签是反引号字符串，里面写 json 和名字。字段必须大写才能被编码。小写字段即使写了标签也不会导出。Unmarshal 要传入指针，否则改的是副本，外面的变量仍是零值。忘记标签时，编码用字段名本身，解码时大小写要匹配。

strconv.Atoi 在错误那一章已经出现。这里可以先 TrimSpace 再解析。组合标准库，而不是自己写解析器。每个导入都要在后面用到，否则文件无法运行。

### 读「切词」

先做这一例。代码收成一行是 `package main import ( "fmt" "strings" ) func main() { fmt.Println(len(strings.Fields("go by example"))) }`。先盖住终端，用手算结果，纸上的文本里要能找到「3」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「3」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「排序端点」

做完上一个再做这一例。代码收成一行是 `package main import ( "fmt" "sort" ) func main() { n := []int{4, 1, 3} sort.Ints(n) fmt.Println(n[0], n[2]) }`。先盖住终端，用手算结果，纸上的文本里要能找到「1 4」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「1 4」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：JSON 字段导出并写上标签，Unmarshal 传入指针。 用「切词」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：大写」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：时间用 Date 构造，不用 Sleep。 用「排序端点」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：大写」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：排序前复制切片，如果调用方还要原来的顺序。 用「切词」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：大写」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：把文本 go 变成大写并打印。 做完再对照「参考答案：大写」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：字符串、排序、时间和 JSON 覆盖大多数小工具。字段要导出，时间要确定，排序是原地的。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```go run expect="3" title="切词"
package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println(len(strings.Fields("go by example")))
}
```

```go run expect="1 4" title="排序端点"
package main

import (
	"fmt"
	"sort"
)

func main() {
	n := []int{4, 1, 3}
	sort.Ints(n)
	fmt.Println(n[0], n[2])
}
```

## 练习

把 JSON `{"name":"Ada"}` 解到结构体并打印 Name。

::: answer 参考答案
```go run expect="Ada" title="参考答案"
package main

import (
	"encoding/json"
	"fmt"
)

type Item struct {
	Name string `json:"name"`
}

func main() {
	var item Item
	if err := json.Unmarshal([]byte(`{"name":"Ada"}`), &item); err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(item.Name)
}
```
:::

把文本 go 变成大写并打印。

::: answer 参考答案：大写
```go run expect="GO" title="参考答案"
package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println(strings.ToUpper("go"))
}
```
:::

## 最佳实践

- JSON 字段导出并写上标签，Unmarshal 传入指针。
- 时间用 Date 构造，不用 Sleep。
- 排序前复制切片，如果调用方还要原来的顺序。

## 小结

字符串、排序、时间和 JSON 覆盖大多数小工具。字段要导出，时间要确定，排序是原地的。

## 常见错误

- 用 time.Sleep 制造先后顺序。这里不保证真实等待，用 channel 交接更明确。
- JSON 字段是小写开头又没有标签。编码时不会导出未导出字段。

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。
