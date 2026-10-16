---
language: rust
chapter: 23
title: "Rust Object-Oriented Programming"
level: advanced
minutes: 8
goals:
  - "Describe behavior with a trait"
  - "Implement the trait for a struct"
  - "Call the trait method from a generic function"
sources:
  - runoob-rust
updated: "2026-10-16"
---

Rust has no class inheritance. Shared behavior lives in a trait. Data lives in a struct.

### A trait with one method

The `impl` block supplies the body of that method.

```rust run expect="船票" title="Label on the gate"
trait Tag {
    fn label(&self) -> &'static str;
}

struct Gate;

impl Tag for Gate {
    fn label(&self) -> &'static str {
        "船票"
    }
}

fn main() {
    println!("{}", Gate.label());
}
```

The label on `Gate` is `船票`.

### A second implementation

The same trait can be attached to another struct, with a method body of its own.

```rust run expect="钢笔" title="Label on the pen"
trait Tag {
    fn label(&self) -> &'static str;
}

struct Pen;

impl Tag for Pen {
    fn label(&self) -> &'static str {
        "钢笔"
    }
}

fn main() {
    println!("{}", Pen.label());
}
```

This run prints `钢笔`.

### A generic function accepts the trait

`impl Tag` means any type that implements `Tag`.

```rust run expect="窗口" title="Function takes a trait"
trait Tag {
    fn label(&self) -> &'static str;
}

struct Gate;

impl Tag for Gate {
    fn label(&self) -> &'static str {
        "窗口"
    }
}

fn show(item: &impl Tag) {
    println!("{}", item.label());
}

fn main() {
    show(&Gate);
}
```

`show` does not name a concrete struct. It only requires `label`, and the line is `窗口`.
