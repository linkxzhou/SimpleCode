---
language: go
chapter: 15
title: "Go 语言切片(Slice)"
level: intermediate
minutes: 8
goals:
  - "区分切片和固定数组"
  - "用 len 和 cap 观察长度与容量"
  - "用 append 增加元素"
sources:
  - gobyexample
updated: "2026-10-15"
---

切片是一段可以增长的序列。它记录指向底层数组的位置、长度和容量。

### 字面量

方括号里不写长度，就是切片而不是数组。

```go run expect="2" title="两个元素"
package main

import "fmt"

func main() {
	nums := []int{8, 9}
	fmt.Println(len(nums))
}
```

输出是 `2`。

### len 和 cap

`len` 是当前元素个数。`cap` 是到底层数组末尾还能容纳多少。字面量刚写出时两者相等。

```go run expect="3 3" title="长度和容量"
package main

import "fmt"

func main() {
	nums := []int{1, 2, 3}
	fmt.Println(len(nums), cap(nums))
}
```

输出是 `3 3`。

### append

`append` 返回可能换了底层数组的新切片，所以要把结果赋回去。

```go run expect="2 2" title="追加"
package main

import "fmt"

func main() {
	nums := []int{1}
	nums = append(nums, 2)
	fmt.Println(len(nums), nums[1])
}
```

输出是 `2 2`。

### 切片表达式

`s[低:高]` 含低下标、不含高下标。它和原切片共享底层数组，改一边会影响另一边。

```go run expect="9" title="共享底层数组"
package main

import "fmt"

func main() {
	nums := []int{1, 2, 3}
	head := nums[:2]
	head[0] = 9
	fmt.Println(nums[0])
}
```

输出是 `9`。
