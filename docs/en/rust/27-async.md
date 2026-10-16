---
language: rust
chapter: 27
title: "Rust Async"
level: advanced
minutes: 8
goals:
  - "Replace async loading with an ordinary function"
  - "Represent unfinished work with an enum"
  - "Remember there is no async runtime"
sources:
  - runoob-rust
updated: "2026-10-16"
---

An `async fn` returns a future that an executor must poll. There is no tokio here, and no multithreaded runtime.

### Load the fare synchronously

The call returns immediately and does not suspend.

```rust run expect="42" title="Synchronous load"
fn load_fare() -> i32 {
    42
}

fn main() {
    println!("{}", load_fare());
}
```

This is the shape of the async example that can run on this page. It prints 42.

### Poll one step yourself

The enum splits "still waiting" from "a number is ready".

```rust run expect="42" title="Poll once"
enum Step {
    Wait,
    Done(i32),
}

fn poll(step: Step) -> Step {
    match step {
        Step::Wait => Step::Done(42),
        done => done,
    }
}

fn main() {
    let step = poll(Step::Wait);
    if let Step::Done(n) = step {
        println!("{n}");
    }
}
```

`Wait` becomes `Done`, and the number inside is 42.

### An async block does not run

Without an executor, the future from an `async` block never advances on its own.

```rust norun title="No async"
fn main() {
    println!("没有执行器");
}
```
