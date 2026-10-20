---
language: go
chapter: 31
title: "Go context"
level: intermediate
minutes: 9
goals:
  - "取消之后读到 Done"
  - "用 WithValue 带上一个字符串"
  - "看到父级取消会传到子级"
sources:
  - gobyexample
updated: "2026-10-20"
---

context 用来传递取消和请求范围里的值。WithCancel 不需要时钟，调用 cancel 后 Done 通道会被关闭。WithTimeout 依赖计时器，在这里标成只读。

### 取消使 Done 关闭

cancel 在 select 之前调用。Done 已经关闭，接收会立刻成功，打印 stop，而不是走 default。

```go run expect="stop" title="已经取消"
package main
import ("context"; "fmt")
func main() {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	select {
	case <-ctx.Done():
		fmt.Println("stop")
	default:
		fmt.Println("go")
	}
}
```

### 附带一个字符串

WithValue 把键 sku 对应到 tea。后面的函数不用再加一个参数，用 Value 就能读回这个字符串。

```go run expect="tea" title="读出 tea"
package main
import ("context"; "fmt")
func main() {
	ctx := context.WithValue(context.Background(), "sku", "tea")
	fmt.Println(ctx.Value("sku"))
}
```

### 父级取消传到子级

child 从 parent 派生。取消 parent 时，child.Done 也会关闭，select 打印 child。

```go run expect="child" title="子级停止"
package main
import ("context"; "fmt")
func main() {
	parent, cancel := context.WithCancel(context.Background())
	child, _ := context.WithCancel(parent)
	cancel()
	select {
	case <-child.Done():
		fmt.Println("child")
	default:
		fmt.Println("open")
	}
}
```

### 没有放入的键

Background 上没有 sku。Value 返回 nil，程序打印 none。不要把 nil 再当成字符串来用。

```go run expect="none" title="键不存在"
package main
import ("context"; "fmt")
func main() {
	ctx := context.Background()
	if ctx.Value("sku") == nil {
		fmt.Println("none")
	}
}
```

### 超时依赖时钟

WithTimeout 内部要用计时器。和 Sleep 一样，它在这个宿主上等不回来，所以只放在阅读块里。取消请用 WithCancel。

```go norun title="不要运行"
ctx, cancel := context.WithTimeout(context.Background(), time.Millisecond)
defer cancel()
<-ctx.Done()
```

Effective Go 只作链接，不搬原文：https://go.dev/doc/effective_go 。
