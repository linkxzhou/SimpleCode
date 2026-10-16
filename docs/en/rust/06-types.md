---
language: rust
chapter: 6
title: "Rust Data Types"
level: beginner
minutes: 8
goals:
  - "Write an i32 and a u32"
  - "Use a boolean"
  - "Tell a character from a string"
sources:
  - runoob-rust
updated: "2026-10-16"
---

rustc must know the type of every name. Literals are often inferred. Add an annotation when inference is not enough.

### Signed and unsigned integers

`i32` may be negative. `u32` holds only zero and positive values. This sample uses a positive `u32`.

```rust run expect="42" title="Pay off the debt"
fn main() {
    let owed: i32 = -3;
    let paid: u32 = 45;
    println!("{}", paid as i32 + owed);
}
```

45 plus -3 equals 42.

### A boolean selects the word

The condition of `if` must be a `bool`. An integer cannot stand in for it.

```rust run expect="开" title="Window is open"
fn main() {
    let open: bool = true;
    let word = if open { "开" } else { "关" };
    println!("{word}");
}
```

`true` selects `开`.

### A character and a string slice

A `char` uses single quotes and stores one Unicode scalar value. A `&str` uses double quotes.

```rust run expect="窗口" title="Join into a window"
fn main() {
    let mark: char = '窗';
    let name: &str = "口";
    println!("{mark}{name}");
}
```

The character and the slice print side by side as `窗口`.
