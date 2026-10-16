---
language: rust
chapter: 24
title: "Rust Concurrency"
level: advanced
minutes: 8
goals:
  - "Call two pieces of work in order"
  - "Pass a value with a vector mailbox"
  - "Remember that threads will not start"
sources:
  - runoob-rust
updated: "2026-10-16"
---

This host has no WASI threads. Keep `thread::spawn` and `sleep` out of runnable blocks. `sleep` would stall while waiting on the clock.

### Add the two results in order

The two functions run in source order. Their results are combined afterward.

```rust run expect="42" title="Sequential sum"
fn left() -> i32 {
    19
}

fn right() -> i32 {
    23
}

fn main() {
    println!("{}", left() + right());
}
```

There is no second thread. 19 plus 23 is still 42.

### Use a vector as a mailbox

One step pushes a number. Later code reads it back. Both steps share one call stack.

```rust run expect="42" title="Number in the mailbox"
fn main() {
    let mut boxy = Vec::new();
    boxy.push(42);
    println!("{}", boxy[0]);
}
```

The value read from index 0 is the 42 that was pushed.

### Thread syntax is for reading only

The program below does not compile here. If it did compile, the calls would not run in parallel.

```rust norun title="Do not spawn"
fn main() {
    println!("nope spawn");
}
```
