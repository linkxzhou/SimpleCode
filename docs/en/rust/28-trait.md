---
language: rust
chapter: 28
title: "Rust traits in more detail"
level: intermediate
minutes: 9
goals:
  - "Call a method that has a default"
  - "Use an associated type for the packed value"
  - "Override the default on one type"
sources:
  - rust-book
  - rust-by-example
updated: "2026-10-20"
---

A trait can include a default method, and an associated type can name the value that implementation handles. There is no Cargo, so every impl stays in this one file. Procedural macros still cannot be loaded.

### The default method returns 0

cents on Price defaults to 0, and Tea only implements label. Adding 4 and 0 yields 4. A missing method does not have to be copied onto every type.

```rust run expect="4" title="Default plus label"
trait Price {
    fn cents(&self) -> i32 {
        0
    }
    fn label(&self) -> i32;
}
struct Tea;
impl Price for Tea {
    fn label(&self) -> i32 {
        4
    }
}
fn main() {
    let tea = Tea;
    println!("{}", tea.cents() + tea.label());
}
```

### Associated type adds one

Item on Pack is i32 for Id. pack receives 6 and returns 7. Another impl could set Item to a different concrete type while callers still write pack.

```rust run expect="7" title="Pack 6"
trait Pack {
    type Item;
    fn pack(&self, v: Self::Item) -> Self::Item;
}
struct Id;
impl Pack for Id {
    type Item = i32;
    fn pack(&self, v: i32) -> i32 {
        v + 1
    }
}
fn main() {
    println!("{}", Id.pack(6));
}
```

### Override the default 0

Cup changes cents to 3 and label is 6. The sum prints 9. The default body is used only when the type does not supply its own method.

```rust run expect="9" title="Cup is 9"
trait Price {
    fn cents(&self) -> i32 {
        0
    }
    fn label(&self) -> i32;
}
struct Cup;
impl Price for Cup {
    fn cents(&self) -> i32 {
        3
    }
    fn label(&self) -> i32 {
        6
    }
}
fn main() {
    let cup = Cup;
    println!("{}", cup.cents() + cup.label());
}
```

### Add two implementations

A yields 2 and B yields 5. total takes any Score reference through impl Trait, and the result is 7.

```rust run expect="7" title="2 plus 5"
trait Score {
    fn get(&self) -> i32;
}
struct A;
struct B;
impl Score for A {
    fn get(&self) -> i32 {
        2
    }
}
impl Score for B {
    fn get(&self) -> i32 {
        5
    }
}
fn total(a: &impl Score, b: &impl Score) -> i32 {
    a.get() + b.get()
}
fn main() {
    println!("{}", total(&A, &B));
}
```

The Rust Programming Language book is further reading only: https://book.douban.com/subject/36547630 . None of its prose or samples are copied here.
