---
language: rust
chapter: 37
title: "Rust tiny flag parser"
level: intermediate
minutes: 10
goals:
  - "Read the number after --qty"
  - "Return 0 when the flag is missing"
  - "Count how many flag pairs are present"
sources:
  - rust-book
  - rust-by-example
updated: "2026-10-20"
---

This small project parses a string slice and does not read real process arguments. Environment variables and the command line have no stable teaching argv here, so the arguments are written in an array. A failed parse becomes 0 instead of a panic.

### Read quantity 4

flag finds --qty and parses the next slot as an integer. The array holds 4, so the print is 4.

```rust run expect="4" title="Quantity flag"
fn flag(args: &[&str], name: &str) -> i32 {
    let mut i = 0;
    while i + 1 < args.len() {
        if args[i] == name {
            return args[i + 1].parse().unwrap_or(0);
        }
        i += 1;
    }
    0
}
fn main() {
    println!("{}", flag(&["--qty", "4", "--sku", "tea"], "--qty"));
}
```

### The flag is absent

The array only has --sku. Searching for --qty reaches the end and returns 0.

```rust run expect="0" title="Missing quantity"
fn flag(args: &[&str], name: &str) -> i32 {
    let mut i = 0;
    while i + 1 < args.len() {
        if args[i] == name {
            return args[i + 1].parse().unwrap_or(0);
        }
        i += 1;
    }
    0
}
fn main() {
    println!("{}", flag(&["--sku", "tea"], "--qty"));
}
```

### Two flag pairs

pairs adds one whenever a slot starts with -- and another value follows. --qty 4 and --sku tea are two pairs, so the print is 2.

```rust run expect="2" title="Two pairs"
fn pairs(args: &[&str]) -> i32 {
    let mut i = 0;
    let mut n = 0;
    while i + 1 < args.len() {
        if args[i].starts_with("--") {
            n += 1;
            i += 2;
        } else {
            i += 1;
        }
    }
    n
}
fn main() {
    println!("{}", pairs(&["--qty", "4", "--sku", "tea"]));
}
```

### A bad parse becomes 0

mug follows --qty and is not an integer. When parse fails, unwrap_or supplies 0.

```rust run expect="0" title="Not an integer"
fn flag(args: &[&str], name: &str) -> i32 {
    let mut i = 0;
    while i + 1 < args.len() {
        if args[i] == name {
            return args[i + 1].parse().unwrap_or(0);
        }
        i += 1;
    }
    0
}
fn main() {
    println!("{}", flag(&["--qty", "mug"], "--qty"));
}
```

sunface/rust-course declares no license, so it is an outline reference only and no sentences are copied: https://github.com/sunface/rust-course .
