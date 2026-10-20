---
language: go
chapter: 35
title: "Go 字符串与排序"
level: intermediate
minutes: 8
goals:
  - "把带空格的数字解析出来"
  - "按空白切开三个词"
  - "对整数和字符串排序"
sources:
  - gobyexample
updated: "2026-10-20"
---

strings、strconv 和 sort 都在标准库里，Yaegi 可以直接导入。Atoi 遇到无法解析的文本会返回错误，这里的输入是干净的，所以用空白标识忽略错误。

### 去掉空格再解析

字符串两边有空格。TrimSpace 去掉之后 Atoi 得到 12，再加 3，打印 15。

```go run expect="15" title="解析 12"
package main
import ("fmt"; "strconv"; "strings")
func main() {
	n, _ := strconv.Atoi(strings.TrimSpace(" 12 "))
	fmt.Println(n + 3)
}
```

### 三个单词

Fields 按空白切开 tea cup mug，得到长度 3。连续空格不会变成空单词。

```go run expect="3" title="切成三份"
package main
import ("fmt"; "strings")
func main() {
	fmt.Println(len(strings.Fields("tea cup mug")))
}
```

### 整数从小到大

sort.Ints 把 3、1、2 排好。排完后第一个元素是 1。

```go run expect="1" title="最小的整数"
package main
import ("fmt"; "sort")
func main() {
	xs := []int{3, 1, 2}
	sort.Ints(xs)
	fmt.Println(xs[0])
}
```

### 变成大写

ToUpper 只改字母。tea 变成 TEA，数字和空格会原样留下，这里没有那些字符。

```go run expect="TEA" title="大写 TEA"
package main
import ("fmt"; "strings")
func main() {
	fmt.Println(strings.ToUpper("tea"))
}
```

### 字符串排序

sort.Strings 按字节比较。cup 比 tea 小，所以排完后第一个是 cup。

```go run expect="cup" title="最小的词"
package main
import ("fmt"; "sort")
func main() {
	xs := []string{"tea", "cup"}
	sort.Strings(xs)
	fmt.Println(xs[0])
}
```
