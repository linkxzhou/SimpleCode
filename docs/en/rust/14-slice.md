---
language: rust
chapter: 14
title: "Rust Slice"
level: intermediate
minutes: 8
goals:
  - "Slice one span of a string"
  - "Slice the tail of an array"
  - "Pass a slice into a function"
sources:
  - runoob-rust
updated: "2026-10-16"
---

A slice borrows a contiguous span and does not own that memory. Indexes count bytes and must fall on a character boundary.

### The second half of a string

Each Chinese character in this literal is three UTF-8 bytes. Skipping the first two characters starts at byte 6.

```rust run expect="船票" title="Last two characters"
fn main() {
    let word = String::from("夜班船票");
    println!("{}", &word[6..]);
}
```

`夜班` is cut away. The remainder is `船票`.

### The tail of an array

The range `1..` starts at index 1 and continues through the last element.

```rust run expect="42" title="Sum the tail"
fn main() {
    let nums = [2, 19, 23];
    let tail = &nums[1..];
    let total: i32 = tail.iter().sum();
    println!("{total}");
}
```

19 and 23 add to 42.

### A function takes a slice

A parameter of type `&[i32]` can borrow an array or a vector.

```rust run expect="42" title="Slice parameter"
fn total(part: &[i32]) -> i32 {
    part.iter().sum()
}

fn main() {
    let nums = [10, 32];
    println!("{}", total(&nums));
}
```

Inside `total` the original array name is not in scope. Only this span is, and it sums to 42.
