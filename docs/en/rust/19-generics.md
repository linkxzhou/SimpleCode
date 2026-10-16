---
language: rust
chapter: 19
title: "Rust Generics and Traits"
level: intermediate
minutes: 8
goals:
  - "Write a type parameter"
  - "Add a trait bound to a parameter"
  - "Implement a trait for a type"
sources:
  - runoob-rust
updated: "2026-10-16"
---

A generic leaves the concrete type until the call. A trait states what those types must be able to do.

### Return the value unchanged

The function does not care which type `T` is.

```rust run expect="42" title="Generic identity"
fn keep<T>(value: T) -> T {
    value
}

fn main() {
    println!("{}", keep(42));
}
```

At the call, `T` is fixed as `i32`, and 42 comes back.

### Require Display

The bound goes in the angle brackets. The body may use `{}` only after that bound is present.

```rust run expect="夜窗" title="Printable generic"
fn show<T: std::fmt::Display>(value: T) -> String {
    format!("{value}")
}

fn main() {
    println!("{}", show("夜窗"));
}
```

`&str` implements `Display`, so the formatted line is `夜窗`.

### Implement a trait on your own type

Every method declared by the trait must appear in the `impl` block.

```rust run expect="42" title="Night fare trait"
trait Fare {
    fn cents(&self) -> i32;
}

struct Night;

impl Fare for Night {
    fn cents(&self) -> i32 {
        42
    }
}

fn main() {
    println!("{}", Night.cents());
}
```

`Night` therefore has `cents`, and that method returns 42.
