---
language: rust
chapter: 13
title: "Rust Ownership"
level: intermediate
minutes: 8
goals:
  - "Clone a string before using both names"
  - "Copy an integer instead of moving it"
  - "Hand ownership into a function"
sources:
  - runoob-rust
updated: "2026-10-16"
---

A `String` moves by default. After the move, the old name cannot be read. Integers implement `Copy`, so a pass copies them.

### clone keeps both names readable

`clone` allocates another heap copy of the text.

```rust run expect="passpass" title="Two tickets"
fn main() {
    let ticket = String::from("pass");
    let copy = ticket.clone();
    println!("{ticket}{copy}");
}
```

Original and copy are both still valid, so the line is `passpass`.

### An integer stays usable

The function receives a copy. The caller's binding remains.

```rust run expect="4242" title="Copy an integer"
fn give(n: i32) -> i32 {
    n
}

fn main() {
    let cents = 42;
    let again = give(cents);
    println!("{cents}{again}");
}
```

Both copies print, which shows as `4242`.

### Move the string into a function

Once the parameter owns the string, the caller must not use that name again.

```rust run expect="weekly" title="Move ownership"
fn hold(ticket: String) -> String {
    ticket
}

fn main() {
    let ticket = String::from("weekly");
    let kept = hold(ticket);
    println!("{kept}");
}
```

The print uses the string the function returned: `weekly`.
