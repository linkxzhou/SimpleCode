---
language: rust
chapter: 7
title: "Rust Comments"
level: beginner
minutes: 8
goals:
  - "Write a line comment with two slashes"
  - "Separate a span with a block comment"
  - "Confirm a comment never becomes output"
sources:
  - runoob-rust
updated: "2026-10-16"
---

Comments are for people reading the source. rustc discards them, so they never become string data.

### A comment at the end of a line

Text after `//` on that line is ignored.

```rust run expect="42" title="Comment at the line end"
fn main() {
    let fare = 42; // 单位是分
    println!("{fare}");
}
```

The unit note stays in the comment. Only 42 is printed.

### A block comment

From `/*` to `*/` the compiler skips the text, and the span may cross lines. Avoid deep nesting. It is hard to read.

```rust run expect="42" title="Middle commented out"
fn main() {
    let fare = 40 + /* 纸袋 */ 2;
    println!("{fare}");
}
```

The addition sees 40 and 2, then prints 42.

### A comment is not a string

Quoted text is printed. Commented text is not.

```rust run expect="这句执行" title="Only one line runs"
fn main() {
    // println!("这句不执行");
    println!("这句执行");
}
```

The commented macro never runs. The line is `这句执行`.
