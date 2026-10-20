---
language: go
chapter: 36
title: "Go 词频"
level: intermediate
minutes: 10
goals:
  - "统计 tea 出现了几次"
  - "找出出现最多的词"
  - "数出不同单词的个数"
sources:
  - gobyexample
updated: "2026-10-20"
---

词频用 map[string]int 就够。Fields 先把一行切成单词，再对每个单词加一。出现次数并列时，遍历 map 的顺序不稳定，所以例子里让一个词明显更多。

### tea 出现两次

句子是 tea tea cup。循环结束后 counts["tea"] 是 2。cup 只有 1，这里不打印它。

```go run expect="2" title="tea 两次"
package main
import ("fmt"; "strings")
func main() {
	counts := map[string]int{}
	for _, w := range strings.Fields("tea tea cup") {
		counts[w]++
	}
	fmt.Println(counts["tea"])
}
```

### 最多的是 tea

tea 出现三次，cup 一次。best 只在 n 更大时更新，所以结果稳定地是 tea。

```go run expect="tea" title="最高词频"
package main
import ("fmt"; "strings")
func main() {
	counts := map[string]int{}
	for _, w := range strings.Fields("tea tea tea cup") {
		counts[w]++
	}
	best, name := 0, ""
	for w, n := range counts {
		if n > best {
			best, name = n, w
		}
	}
	fmt.Println(name)
}
```

### 两种不同的词

a a b 里 a 重复了，map 的键只有 a 和 b。len(counts) 是 2。

```go run expect="2" title="两个键"
package main
import ("fmt"; "strings")
func main() {
	counts := map[string]int{}
	for _, w := range strings.Fields("a a b") {
		counts[w]++
	}
	fmt.Println(len(counts))
}
```

### 一共四个词

这一题不看重复，只数 Fields 切出来的个数。tea cup tea mug 有 4 个词。

```go run expect="4" title="四个词"
package main
import ("fmt"; "strings")
func main() {
	fmt.Println(len(strings.Fields("tea cup tea mug")))
}
```
