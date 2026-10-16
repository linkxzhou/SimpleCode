---
language: rust
chapter: 18
title: "Rust Error Handling"
level: intermediate
minutes: 8
goals:
  - "Return a parse result with Result"
  - "Return an error early with the question mark"
  - "Supply a default with unwrap_or"
sources:
  - runoob-rust
updated: "2026-10-16"
---

Recoverable failure uses `Result`. A real `panic!` aborts the process, because this compiler is built with `panic=abort`.

### A successful parse

On failure, `parse` produces `ParseIntError`. On success it produces the number.

```rust run expect="42" title="Parse forty-two"
fn cents(text: &str) -> Result<i32, std::num::ParseIntError> {
    text.parse()
}

fn main() {
    println!("{}", cents("42").unwrap());
}
```

The string is all digits, so parsing succeeds and prints 42.

### The question mark forwards an error

On `Err`, `?` returns at once. On success it takes out the inner value.

```rust run expect="42" title="Double after parsing"
fn double(text: &str) -> Result<i32, std::num::ParseIntError> {
    let n: i32 = text.parse()?;
    Ok(n * 2)
}

fn main() {
    println!("{}", double("21").unwrap());
}
```

21 is doubled to 42.

### Use a default when parsing fails

Do not call `unwrap` on a parse that is certain to fail. The process would abort.

```rust run expect="0" title="Zero when parsing fails"
fn main() {
    let bad = "票".parse::<i32>().unwrap_or(0);
    println!("{bad}");
}
```

The character `票` is not an integer, so the fallback is 0.
