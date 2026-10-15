---
language: go
chapter: 27
title: "Go 文件处理"
level: advanced
minutes: 8
goals:
  - "知道本页没有宿主机上的磁盘"
  - "用 strings.Builder 拼出要写入的文本"
  - "按行切分已经放在内存里的内容"
sources:
  - gobyexample
updated: "2026-10-15"
---

本机可以用 `os` 创建文件。这个抽屉的解释器没有给你的磁盘，可运行例子只处理内存里的文本。

### 不能写宿主机路径

`os.WriteFile` 在这里没有可依赖的目录。下面只说明本机上的形状，不执行。

```go norun title="本页不写磁盘"
os.WriteFile("note.txt", []byte("茶\n"), 0644)
```

### 在内存里拼文本

`strings.Builder` 用来累积将要写出去的字节。`String` 取出结果。

```go run expect="茶" title="拼两行"
package main

import (
	"fmt"
	"strings"
)

func main() {
	var b strings.Builder
	b.WriteString("茶\n")
	b.WriteString("水\n")
	fmt.Println(strings.Split(b.String(), "\n")[0])
}
```

输出是 `茶`。

### 按行切开

已经在字符串里的“文件内容”用 `Split` 按换行切开。最后一项可能是空串，因为文本以换行结束。

```go run expect="2" title="两个非空行"
package main

import (
	"fmt"
	"strings"
)

func main() {
	text := "茶\n水\n"
	n := 0
	for _, line := range strings.Split(text, "\n") {
		if line != "" {
			n++
		}
	}
	fmt.Println(n)
}
```

输出是 `2`。

### 读回来仍是字符串

没有文件句柄时，核对内容就是核对字符串。`Contains` 看某一行是否在里面。

```go run expect="true" title="找一行"
package main

import (
	"fmt"
	"strings"
)

func main() {
	text := "茶\n水\n"
	fmt.Println(strings.Contains(text, "水\n"))
}
```

输出是 `true`。
