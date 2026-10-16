---
language: rust
chapter: 3
title: "Rust Output"
level: beginner
minutes: 8
goals:
  - "Break lines with println"
  - "Join two pieces on one line with print"
  - "Build a string with format first"
sources:
  - runoob-rust
updated: "2026-10-16"
---

Output macros write values to standard output. Leave a placeholder if you want a value to appear.

### A line that ends

Braces line up with arguments, one pair per value.

```rust run expect="fare42" title="Fare"
fn main() {
    println!("fare{}", 42);
}
```

The finished line is `fare42`, and it already ends with a newline.

### Continue on the same line

`print!` does not break the line. The next `println!` closes it.

```rust run expect="copperkey" title="Join into one key"
fn main() {
    print!("copper");
    println!("key");
}
```

The two macros together produce `copperkey`.

### Format before printing

`format!` returns a `String`. It does not write to the terminal by itself.

```rust run expect="7 window" title="Build a string first"
fn main() {
    let line = format!("{} window", 7);
    println!("{line}");
}
```

What appears is the assembled string `7 window`.
