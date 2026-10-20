---
language: go
chapter: 35
title: "Go strings and sort"
level: intermediate
minutes: 8
goals:
  - "Parse a number that has spaces"
  - "Split three words on whitespace"
  - "Sort integers and strings"
sources:
  - gobyexample
updated: "2026-10-20"
---

strings, strconv, and sort are in the standard library, and Yaegi can import them. Atoi returns an error for text it cannot parse. This input is clean, so the blank identifier drops that error.

### Trim, then parse

The string has spaces on both sides. After TrimSpace, Atoi yields 12, adding 3 prints 15.

```go run expect="15" title="Parse 12"
package main
import ("fmt"; "strconv"; "strings")
func main() {
	n, _ := strconv.Atoi(strings.TrimSpace(" 12 "))
	fmt.Println(n + 3)
}
```

### Three words

Fields splits tea cup mug on whitespace and the length is 3. Repeated spaces do not become empty words.

```go run expect="3" title="Split into three"
package main
import ("fmt"; "strings")
func main() {
	fmt.Println(len(strings.Fields("tea cup mug")))
}
```

### Integers ascending

sort.Ints orders 3, 1, and 2. After sorting, the first element is 1.

```go run expect="1" title="Smallest integer"
package main
import ("fmt"; "sort")
func main() {
	xs := []int{3, 1, 2}
	sort.Ints(xs)
	fmt.Println(xs[0])
}
```

### Upper case

ToUpper changes letters. tea becomes TEA. Digits and spaces would stay as they are. This string has neither.

```go run expect="TEA" title="Upper TEA"
package main
import ("fmt"; "strings")
func main() {
	fmt.Println(strings.ToUpper("tea"))
}
```

### Sort strings

sort.Strings compares bytes. cup is less than tea, so the first string after sorting is cup.

```go run expect="cup" title="Smallest word"
package main
import ("fmt"; "sort")
func main() {
	xs := []string{"tea", "cup"}
	sort.Strings(xs)
	fmt.Println(xs[0])
}
```
