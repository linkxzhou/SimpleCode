---
language: rust
chapter: 0
title: "Rust Tutorial"
minutes: 8
goals:
  - "Print one line with println"
  - "Add three numbers with Vec"
  - "Remember that Cargo is absent"
sources:
  - runoob-rust
updated: "2026-10-16"
---

This book compiles a single `main.rs`. The compiler is weblings rustc in the browser, and the target is `wasm32-wasip1`.

### Print one line

`println!` appends a newline. Each `{}` takes the next argument.

```rust run expect="船票" title="One printed line"
fn main() {
    println!("窗口打出{}", "船票");
}
```

The line on the terminal is `船票`.

### Add three numbers

`vec!` builds a growable list. `sum` needs an explicit result type.

```rust run expect="42" title="Three fares"
fn main() {
    let fares = vec![4, 15, 23];
    let total: i32 = fares.iter().sum();
    println!("{total}");
}
```

Adding 4, 15, and 23 yields 42.

### Cargo is absent

No manifest is loaded, and crates.io cannot be fetched. The block below is not executed.

```rust norun title="No cargo"
fn main() {
    println!("cargo new 不会在这里跑");
}
```
