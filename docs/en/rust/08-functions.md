---
language: rust
chapter: 8
title: "Rust Functions"
level: beginner
minutes: 8
goals:
  - "Write a function with parameters"
  - "Use the last expression as the return value"
  - "Call it from main"
sources:
  - runoob-rust
updated: "2026-10-16"
---

Declare a function with `fn`. Write a type for every parameter and for the return value.

### Pass two fares

Arguments follow the parameter order.

```rust run expect="42" title="Add function"
fn add(left: i32, right: i32) -> i32 {
    left + right
}

fn main() {
    println!("{}", add(19, 23));
}
```

19 and 23 add to 42. The line without a semicolon is the returned value.

### Return before the end

`return` can leave the function in the middle of the body.

```rust run expect="openwin" title="Return early"
fn label(open: bool) -> &'static str {
    if open {
        return "openwin";
    }
    "shutwin"
}

fn main() {
    println!("{}", label(true));
}
```

When `open` is true, that `return` runs and the line is `openwin`.

### No return value

Omitting the return type makes the result the unit value. Functions like this usually print.

```rust run expect="callfirst" title="Print only"
fn shout(name: &str) {
    println!("call{name}");
}

fn main() {
    shout("first");
}
```

`shout` writes the line itself: `callfirst`.
