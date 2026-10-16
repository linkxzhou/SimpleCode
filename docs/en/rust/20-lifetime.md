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

```rust run expect="pass" title="Return the left side"
fn earlier<'a>(left: &'a str, _right: &'a str) -> &'a str {
    left
}

fn main() {
    let ticket = String::from("pass");
    let pen = String::from("fountain");
    println!("{}", earlier(&ticket, &pen));
}
```

The returned slice still points at `ticket`, and the line is `pass`.

### Both local strings live through the call

The call happens while both `String` values still exist, so the borrows stay valid.

```rust run expect="openwin" title="Pick by a flag"
fn pick<'a>(open: bool, yes: &'a str, no: &'a str) -> &'a str {
    if open { yes } else { no }
}

fn main() {
    let yes = String::from("openwin");
    let no = String::from("shutwin");
    println!("{}", pick(true, &yes, &no));
}
```

`true` selects the first text, `openwin`.

### The static lifetime

A string literal lasts for the whole program and may be marked `'static`.

```rust run expect="window" title="Static window"
fn label() -> &'static str {
    "window"
}

fn main() {
    println!("{}", label());
}
```

No local variable has to outlive this call. The line is `window`.
