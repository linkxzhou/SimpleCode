---
language: rust
chapter: 5
title: "Rust Operators"
level: beginner
minutes: 8
goals:
  - "Add, subtract, and multiply"
  - "Compare two numbers"
  - "Combine conditions with logical and"
sources:
  - runoob-rust
updated: "2026-10-16"
---

Arithmetic and comparisons are expressions. A comparison produces a `bool`.

### Multiply after adding

`*` binds more tightly than `+`. Parentheses force the addition to run first.

```rust run expect="42" title="Add then multiply"
fn main() {
    let fare = (20 + 1) * 2;
    println!("{fare}");
}
```

`(20 + 1) * 2` equals 42.

### Test equality

`==` compares the two sides and changes neither of them.

```rust run expect="true" title="Two eighteens"
fn main() {
    let same = 18 == 18;
    println!("{same}");
}
```

Equal numbers print `true`.

### Both sides must be true

`&&` is true only when each operand is true.

```rust run expect="true" title="Open and paid"
fn main() {
    let open = true;
    let paid = true;
    println!("{}", open && paid);
}
```

With both flags set, the expression prints `true`.
