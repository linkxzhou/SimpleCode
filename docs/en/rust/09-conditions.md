---
language: rust
chapter: 9
title: "Rust Conditions"
level: beginner
minutes: 8
goals:
  - "Choose a line with if"
  - "Attach the other line with else"
  - "Treat if as an expression"
sources:
  - runoob-rust
updated: "2026-10-16"
---

An `if` condition is a boolean. Each branch has its own braces.

### Print only when the fare is paid

A false condition skips the statements inside the braces.

```rust run expect="paid" title="Paid in full"
fn main() {
    let paid = 42;
    if paid == 42 {
        println!("paid");
    }
}
```

`paid` appears only because the amounts are equal.

### else covers the remaining case

`else` receives every case the `if` did not take.

```rust run expect="short" title="Not enough money"
fn main() {
    let paid = 10;
    if paid == 42 {
        println!("paid");
    } else {
        println!("short");
    }
}
```

10 is not 42, so control enters `else` and prints `short`.

### A branch produces a value

Both branches must share one type. The result can be bound to a name.

```rust run expect="night" title="Pick a shift by the hour"
fn main() {
    let hour = 23;
    let shift = if hour >= 18 { "night" } else { "day" };
    println!("{shift}");
}
```

Hour 23 falls in `night`.
