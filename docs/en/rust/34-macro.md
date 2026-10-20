---
language: rust
chapter: 34
title: "Rust declarative macros"
level: advanced
minutes: 9
goals:
  - "Write one arm for two arguments and one for three"
  - "Keep the last expression with repetition"
  - "Remember that procedural macros need their own crate"
sources:
  - rust-book
updated: "2026-10-20"
---

macro_rules picks an arm by pattern and expands it into ordinary code at compile time. Repetition uses forms such as $($name:expr),+. A procedural macro is a function in another crate. There is no cargo here, so that case is reading-only.

### Add three numbers

The two-argument arm is not used here. The three-argument arm adds 1, 2, and 4. After expansion it is ordinary addition and prints 7.

```rust run expect="7" title="Expanded addition"
macro_rules! addm {
    ($a:expr, $b:expr) => { $a + $b };
    ($a:expr, $b:expr, $c:expr) => { $a + $b + $c };
}
fn main() {
    println!("{}", addm!(1, 2, 4));
}
```

### Keep the last one

A single expression is used as itself. With several expressions the first is dropped and the rest expand again. From 5, 6, and 8 the last value is 8.

```rust run expect="8" title="The last one"
macro_rules! lastm {
    ($x:expr) => { $x };
    ($x:expr, $($rest:expr),+) => { lastm!($($rest),+) };
}
fn main() {
    println!("{}", lastm!(5, 6, 8));
}
```

### The two-argument arm

The exercise passes only 2 and 5. That matches the first arm and prints 7. Macros expand before type checking, so a bad expression fails like ordinary code.

```rust run expect="7" title="Add two numbers"
macro_rules! addm {
    ($a:expr, $b:expr) => { $a + $b };
    ($a:expr, $b:expr, $c:expr) => { $a + $b + $c };
}
fn main() {
    println!("{}", addm!(2, 5));
}
```

### Procedural macros cannot load

The proc_macro attribute has to be compiled in its own crate and then imported elsewhere. This page has only one main.rs, so the attribute below does not run.

```rust norun title="No procedural macro"
#[proc_macro]
pub fn nope(input: TokenStream) -> TokenStream {
    input
}
```
