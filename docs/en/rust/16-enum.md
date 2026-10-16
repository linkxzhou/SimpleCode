---
language: rust
chapter: 16
title: "Rust Enums"
level: intermediate
minutes: 8
goals:
  - "Distinguish variants with match"
  - "Represent a missing value with Option"
  - "Look at one variant with if let"
sources:
  - runoob-rust
updated: "2026-10-16"
---

Each enum variant is one possibility. `match` must cover every variant, or the program fails to compile.

### Open or shut

Two variants with no data are enough to describe a switch.

```rust run expect="open" title="Match open"
enum Gate {
    Open,
    Shut,
}

fn main() {
    let gate = Gate::Open;
    let word = match gate {
        Gate::Open => "open",
        Gate::Shut => "shut",
    };
    println!("{word}");
}
```

The active variant is `Open`, so the line is `open`.

### A number inside Option

`Some` holds a value. `None` means nothing is there. `unwrap_or` supplies a default for `None`.

```rust run expect="42" title="Fare is present"
fn main() {
    let fare: Option<i32> = Some(42);
    println!("{}", fare.unwrap_or(0));
}
```

A value is present, so the default 0 is unused and 42 is printed.

### if let opens one variant

When the other variants do not matter, `if let` skips the extra arms.

```rust run expect="42" title="Only Some"
fn main() {
    let fare = Some(42);
    if let Some(n) = fare {
        println!("{n}");
    }
}
```

The inner number is printed only after the pattern matches: 42.
