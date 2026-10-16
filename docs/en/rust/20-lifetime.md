---
language: rust
chapter: 20
title: "Rust Lifetimes"
level: intermediate
minutes: 8
goals:
  - "Mark two borrows with the same lifetime"
  - "Return one of those borrows"
  - "Return a static string"
sources:
  - runoob-rust
updated: "2026-10-16"
---

A borrow must not outlive the data it points at. Lifetime labels describe that relationship to rustc. They do not change what runs.

### Return the argument that appears first

Both parameters share `'a`, so the returned borrow cannot outlive either input.

```rust run expect="船票" title="Return the left side"
fn earlier<'a>(left: &'a str, _right: &'a str) -> &'a str {
    left
}

fn main() {
    let ticket = String::from("船票");
    let pen = String::from("钢笔");
    println!("{}", earlier(&ticket, &pen));
}
```

The returned slice still points at `ticket`, and the line is `船票`.

### Both local strings live through the call

The call happens while both `String` values still exist, so the borrows stay valid.

```rust run expect="开窗" title="Pick by a flag"
fn pick<'a>(open: bool, yes: &'a str, no: &'a str) -> &'a str {
    if open { yes } else { no }
}

fn main() {
    let yes = String::from("开窗");
    let no = String::from("关窗");
    println!("{}", pick(true, &yes, &no));
}
```

`true` selects the first text, `开窗`.

### The static lifetime

A string literal lasts for the whole program and may be marked `'static`.

```rust run expect="窗口" title="Static window"
fn label() -> &'static str {
    "窗口"
}

fn main() {
    println!("{}", label());
}
```

No local variable has to outlive this call. The line is `窗口`.
