---
language: go
chapter: 34
title: "Go 反射"
level: advanced
minutes: 9
goals:
  - "读出结构体的 Qty 字段"
  - "数出字段个数"
  - "通过指针改一个整数"
sources:
  - gobyexample
updated: "2026-10-20"
---

reflect 在运行时查看类型和值。导出字段才能被别的包读到；这里字段都在 main 里，名字大写即可。用指针的 Elem 才能 SetInt，值本身是不可改的。

### 读出数量

Item 的 Qty 是 4。FieldByName 找到这个字段，Int 把它变成 int64，Println 打印 4。

```go run expect="4" title="字段 Qty"
package main
import ("fmt"; "reflect")
type Item struct {
	Name string
	Qty  int
}
func main() {
	v := reflect.ValueOf(Item{"tea", 4})
	fmt.Println(v.FieldByName("Qty").Int())
}
```

### 字段有两个

Name 和 Qty 都算一个字段。NumField 返回 2。未导出的小写字段在别的包里不会出现，这里没有那种字段。

```go run expect="2" title="两个字段"
package main
import ("fmt"; "reflect")
type Item struct {
	Name string
	Qty  int
}
func main() {
	t := reflect.TypeOf(Item{})
	fmt.Println(t.NumField())
}
```

### 改掉原来的 1

ValueOf 指向 item 的地址，Elem 才是可设置的结构体。SetInt(9) 之后 item.Qty 变成 9。

```go run expect="9" title="改成 9"
package main
import ("fmt"; "reflect")
type Item struct {
	Name string
	Qty  int
}
func main() {
	item := Item{"tea", 1}
	p := reflect.ValueOf(&item).Elem()
	p.FieldByName("Qty").SetInt(9)
	fmt.Println(item.Qty)
}
```

### 整数的种类

TypeOf(4).Kind 是 int。字符串形式打印出来就是 int，不是具体的变量名。

```go run expect="int" title="种类 int"
package main
import ("fmt"; "reflect")
func main() {
	fmt.Println(reflect.TypeOf(4).Kind().String())
}
```

### 读出名字

同一个结构体的 Name 字段是 tea。String 取出这个导出字段的文本。

```go run expect="tea" title="字段 Name"
package main
import ("fmt"; "reflect")
type Item struct {
	Name string
	Qty  int
}
func main() {
	v := reflect.ValueOf(Item{"tea", 4})
	fmt.Println(v.FieldByName("Name").String())
}
```
