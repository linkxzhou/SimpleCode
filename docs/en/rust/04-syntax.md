---
language: rust
chapter: 4
title: "Rust Basic Syntax"
level: beginner
minutes: 8
goals:
  - "Bind a name with let"
  - "Change a binding with mut"
  - "Shadow an old name with a new binding"
sources:
  - runoob-rust
updated: "2026-10-16"
---

A statement ends with a semicolon. A `let` binding cannot be changed unless you write `mut`.

### Bind a number

The name `fare` is visible inside `main`.

```rust run expect="42" title="Bind a fare"
fn main() {
    let fare = 42;
    println!("{fare}");
}
```

The number printed is that binding, 42.

### A mutable binding

`+=` is legal only after `mut`.

```rust run expect="42" title="Add twenty-two"
fn main() {
    let mut fare = 20;
    fare += 22;
    println!("{fare}");
}
```

20 plus 22 is 42.

### Shadow the previous name

A second `let` on the same name hides the earlier value from later code.

```rust run expect="新窗" title="The later name"
fn main() {
    let label = "旧窗";
    let label = "新窗";
    println!("{label}");
}
```

`旧窗` never reaches the terminal. The line is `新窗`.
