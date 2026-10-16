---
language: rust
chapter: 10
title: "Rust Loops"
level: beginner
minutes: 8
goals:
  - "Leave loop with break"
  - "Watch a condition with while"
  - "Walk a range with for"
sources:
  - runoob-rust
updated: "2026-10-16"
---

`loop`, `while`, and `for` each repeat a block. Stop by changing the condition or by using `break`.

### Break out of loop

`loop` itself never ends. `break` is what leaves it.

```rust run expect="42" title="Count up to forty-two"
fn main() {
    let mut n = 0;
    loop {
        n += 7;
        if n == 42 {
            break;
        }
    }
    println!("{n}");
}
```

Repeated addition of 7 stops when `n` reaches 42.

### while watches what is left

The loop stops once the condition is false.

```rust run expect="剩余0" title="Down to zero"
fn main() {
    let mut left = 3;
    while left > 0 {
        left -= 1;
    }
    println!("剩余{left}");
}
```

After three decrements the line is `剩余0`.

### for walks a closed range

`1..=3` includes both endpoints.

```rust run expect="6" title="Sum from one to three"
fn main() {
    let mut total = 0;
    for n in 1..=3 {
        total += n;
    }
    println!("{total}");
}
```

1, 2, and 3 add up to 6.
