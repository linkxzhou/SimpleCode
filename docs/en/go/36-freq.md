---
language: go
chapter: 36
title: "Go word counts"
level: intermediate
minutes: 10
goals:
  - "Count how often tea appears"
  - "Find the word that appears most"
  - "Count distinct words"
sources:
  - gobyexample
updated: "2026-10-20"
---

A map[string]int is enough for word counts. Fields splits a line into words, then each word is incremented. Map iteration order is unstable on a tie, so these examples give one word a clear lead.

### tea appears twice

The line is tea tea cup. After the loop, counts["tea"] is 2. cup is only 1 and is not printed.

```go run expect="2" title="tea twice"
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

### tea is the most common

tea appears three times and cup once. best changes only when n is larger, so the result is stably tea.

```go run expect="tea" title="Highest count"
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

### Two distinct words

In a a b the word a is repeated, so the map keys are only a and b. len(counts) is 2.

```go run expect="2" title="Two keys"
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

### Four tokens in all

This exercise ignores duplicates and counts what Fields returns. tea cup tea mug has 4 tokens.

```go run expect="4" title="Four tokens"
package main
import ("fmt"; "strings")
func main() {
	fmt.Println(len(strings.Fields("tea cup tea mug")))
}
```
