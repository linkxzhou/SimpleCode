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

Byte 6 of `night pass` is where `pass` begins.

```rust run expect="pass" title="Last two characters"
fn main() {
    let word = String::from("night pass");
    println!("{}", &word[6..]);
}
```

The first half is cut away. The remainder is `pass`.

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
