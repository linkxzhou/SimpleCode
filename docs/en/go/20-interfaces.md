---
language: go
chapter: 20
title: "Go Interfaces"
level: intermediate
minutes: 8
goals:
  - "Describe a set of methods with an interface"
  - "Satisfy the interface without an implements clause"
  - "Store a concrete value in an interface variable"
sources:
  - gobyexample
updated: "2026-10-16"
---

An interface names methods and nothing else. A type that has those methods satisfies the interface. There is no `implements` keyword.

### A set of methods

Each method in the interface lists a name, parameters, and results.

```go run expect="meow" title="An interface variable"
package main

import "fmt"

type Speaker interface {
	Speak() string
}

type Cat struct{}

func (Cat) Speak() string {
	return "meow"
}

func main() {
	var s Speaker = Cat{}
	fmt.Println(s.Speak())
}
```

The cat says `meow`.

### Implicit satisfaction

Assignment to the interface succeeds when the methods line up. Leave one method out and compilation fails.

```go run expect="woof" title="Another implementation"
package main

import "fmt"

type Speaker interface {
	Speak() string
}

type Dog struct{}

func (Dog) Speak() string {
	return "woof"
}

func main() {
	say := func(s Speaker) {
		fmt.Println(s.Speak())
	}
	say(Dog{})
}
```

The dog says `woof`.

### Data stored in the interface

An interface value holds a concrete type together with concrete data. The method call uses that concrete type.

```go run expect="lin" title="Carrying data"
package main

import "fmt"

type Named interface {
	Name() string
}

type User struct {
	name string
}

func (u User) Name() string {
	return u.name
}

func main() {
	var n Named = User{name: "lin"}
	fmt.Println(n.Name())
}
```

The stored name is `lin`.

### any

`any` is the empty interface, so every value fits. Calling a method that exists only on the concrete type needs a type assertion afterward.

```go run expect="5" title="The empty interface"
package main

import "fmt"

func main() {
	var v any = 5
	fmt.Println(v)
}
```

The boxed number prints `5`.
