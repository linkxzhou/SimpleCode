---
language: rust
chapter: 29
title: "Rust trait objects"
level: intermediate
minutes: 9
goals:
  - "Call a method through dyn"
  - "Store two types in one vector"
  - "Pick a concrete type from a flag"
sources:
  - rust-book
updated: "2026-10-20"
---

dyn Score is a fixed-size fat pointer to a concrete value and a method table. Different types can then share one Vec. An object-safe method cannot return Self or take generic parameters.

### Read 4 through dyn

The parameter of show has type &dyn Score, so the function body does not see the concrete name A. get on A returns 4.

```rust run expect="4" title="Dynamic dispatch"
trait Score {
    fn get(&self) -> i32;
}
struct A;
impl Score for A {
    fn get(&self) -> i32 {
        4
    }
}
fn show(s: &dyn Score) -> i32 {
    s.get()
}
fn main() {
    println!("{}", show(&A));
}
```

### Two scores in a vector

Box<dyn Score> keeps the size of A and B from affecting the vector slots. 4 plus 5 is 9.

```rust run expect="9" title="4 plus 5"
trait Score {
    fn get(&self) -> i32;
}
struct A;
struct B;
impl Score for A {
    fn get(&self) -> i32 {
        4
    }
}
impl Score for B {
    fn get(&self) -> i32 {
        5
    }
}
fn main() {
    let items: Vec<Box<dyn Score>> = vec![Box::new(A), Box::new(B)];
    let mut sum = 0;
    for item in items.iter() {
        sum += item.get();
    }
    println!("{sum}");
}
```

### Take B when the flag is false

pick returns Box<dyn Score>. When flag is false it stores B, whose get is 1. The caller uses the return value only through the trait.

```rust run expect="1" title="Choose B"
trait Score {
    fn get(&self) -> i32;
}
struct A;
struct B;
impl Score for A {
    fn get(&self) -> i32 {
        8
    }
}
impl Score for B {
    fn get(&self) -> i32 {
        1
    }
}
fn pick(flag: bool) -> Box<dyn Score> {
    if flag { Box::new(A) } else { Box::new(B) }
}
fn main() {
    println!("{}", pick(false).get());
}
```

### Add two objects

both accepts two &dyn Score values. Adding 3 and 6 prints 9. This exercise does not use a vector. The parameters are references.

```rust run expect="9" title="3 plus 6"
trait Score {
    fn get(&self) -> i32;
}
struct A;
struct B;
impl Score for A {
    fn get(&self) -> i32 {
        3
    }
}
impl Score for B {
    fn get(&self) -> i32 {
        6
    }
}
fn both(x: &dyn Score, y: &dyn Score) -> i32 {
    x.get() + y.get()
}
fn main() {
    println!("{}", both(&A, &B));
}
```
