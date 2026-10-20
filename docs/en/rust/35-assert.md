---
language: rust
chapter: 35
title: "Rust assertions"
level: intermediate
minutes: 8
goals:
  - "Check addition with assert_eq inside main"
  - "Check two equalities in a row"
  - "Know that cargo test cannot run here"
sources:
  - rust-book
updated: "2026-10-20"
---

#[test] is started by cargo test. This compiler builds main.rs and runs main directly, so a test function is never called. assert_eq can still live in main. Failure panics, and success continues to the print.

### 2 plus 3 equals 5

assert_eq prints nothing when both sides are 5. The next line prints ok, which shows the program did not stop at the assertion.

```rust run expect="ok" title="Assertion passes"
fn add(a: i32, b: i32) -> i32 {
    a + b
}
fn main() {
    assert_eq!(add(2, 3), 5);
    println!("ok");
}
```

### Then check multiplication

The first assertion checks addition and the second checks 2 times 4. After both pass, the program prints pass.

```rust run expect="pass" title="Two assertions"
fn main() {
    assert_eq!(2 + 3, 5);
    assert_eq!(2 * 4, 8);
    println!("pass");
}
```

### Inequality panics

If the expected value were 0, assert_eq would panic and the later print would not run. The runnable examples keep both sides equal. The failing line below is shown and not executed.

```rust norun title="Do not run"
assert_eq!(2 + 2, 0);
```

### cargo test is absent

Without Cargo there is no test harness. A function marked #[test] is not called by this way of running, even if it compiles.

```rust norun title="Tests do not start"
#[test]
fn add_works() {
    assert_eq!(2 + 2, 4);
}
```
