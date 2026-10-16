---
language: rust
chapter: 12
title: "Rust Closures"
level: beginner
minutes: 8
goals:
  - "Write a closure that takes a parameter"
  - "Capture an outer binding"
  - "Hand a closure to filter"
sources:
  - runoob-rust
updated: "2026-10-16"
---

A closure is an anonymous function you can store. Its parameters sit between vertical bars.

### Add a fixed number

Call it the way you call an ordinary function.

```rust run expect="42" title="Closure adds"
fn main() {
    let add = |n: i32| n + 19;
    println!("{}", add(23));
}
```

23 plus 19 equals 42.

### Capture the outer fare

The closure reads `fare` from the enclosing `main`.

```rust run expect="42" title="Capture and double"
fn main() {
    let fare = 21;
    let double = || fare * 2;
    println!("{}", double());
}
```

There is no parameter. The body uses the outer 21 and prints 42.

### Use the closure as a predicate

`filter` accepts a closure.

```rust run expect="1" title="Count forty-two"
fn main() {
    let fares = [8, 42, 3];
    let hit = fares.iter().copied().filter(|n| *n == 42).count();
    println!("{hit}");
}
```

Only one element equals 42, so the count is 1.
