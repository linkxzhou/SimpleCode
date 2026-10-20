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

```rust run expect="pass" title="One printed line"
fn main() {
    println!("say {}", "pass");
}
```

The line on the terminal is `pass`.

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
    println!("cargo new will not run here");
}
```
### After chapter 28

Default trait methods, associated types, dyn, iterator adapters, Box, Rc, RefCell, the question mark, patterns, declarative macros, assertions, unsafe, and a small flag parser follow the async chapter. There is no Cargo, so procedural macros and cargo test are reading-only. Dereferencing a null pointer is reading-only too.
