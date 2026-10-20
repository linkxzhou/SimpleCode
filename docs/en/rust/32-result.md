---
language: rust
chapter: 32
title: "Rust question mark and Result"
level: intermediate
minutes: 9
goals:
  - "Pull 4 out of Ok with the question mark"
  - "Print bad on the error branch"
  - "Let the question mark cross two functions"
sources:
  - rust-book
updated: "2026-10-20"
---

Result splits success and failure into two variants. The question mark unwraps Ok and returns Err from the current function. The function error type must match the error on the left of the question mark. These samples share one static string.

### Success yields 5

parse returns Ok when it sees 4. load takes 4 with the question mark and adds 1. unwrap in main prints 5.

```rust run expect="5" title="4 plus 1"
fn parse(text: &str) -> Result<i32, &'static str> {
    if text == "4" { Ok(4) } else { Err("bad") }
}
fn load() -> Result<i32, &'static str> {
    let n = parse("4")?;
    Ok(n + 1)
}
fn main() {
    println!("{}", load().unwrap());
}
```

### Failure prints bad

The text is x, so parse returns Err. match does not call unwrap, so there is no panic, and the terminal shows bad.

```rust run expect="bad" title="Error text"
fn parse(text: &str) -> Result<i32, &'static str> {
    if text == "4" { Ok(4) } else { Err("bad") }
}
fn main() {
    match parse("x") {
        Ok(v) => println!("{v}"),
        Err(msg) => println!("{msg}"),
    }
}
```

### Question marks on two levels

outer calls inner, and inner calls parse. An Err at either level skips the later addition. The input here is 4, so both levels succeed and the print is 6.

```rust run expect="6" title="Add twice"
fn parse(text: &str) -> Result<i32, &'static str> {
    if text == "4" { Ok(4) } else { Err("bad") }
}
fn inner() -> Result<i32, &'static str> {
    let n = parse("4")?;
    Ok(n + 1)
}
fn outer() -> Result<i32, &'static str> {
    let n = inner()?;
    Ok(n + 1)
}
fn main() {
    println!("{}", outer().unwrap());
}
```

### An empty string is also an error

The exercise passes an empty string to parse. It is not 4, so the error arm of match prints bad.

```rust run expect="bad" title="Empty text"
fn parse(text: &str) -> Result<i32, &'static str> {
    if text == "4" { Ok(4) } else { Err("bad") }
}
fn main() {
    match parse("") {
        Ok(v) => println!("{v}"),
        Err(msg) => println!("{msg}"),
    }
}
```
