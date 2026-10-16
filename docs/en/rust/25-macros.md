---
language: rust
chapter: 25
title: "Rust Macros"
level: advanced
minutes: 8
goals:
  - "Write a declarative macro with macro_rules"
  - "Expand it from main"
  - "Remember that procedural macros cannot load"
sources:
  - runoob-rust
updated: "2026-10-16"
---

`println!` is a macro. A declarative macro of your own uses `macro_rules!`. A procedural macro needs a separate crate, which this page does not have.

### Add the argument twice

`$n:expr` matches one expression and is pasted into the expansion twice.

```rust run expect="42" title="Expand twice"
macro_rules! twice {
    ($n:expr) => {
        $n + $n
    };
}

fn main() {
    println!("{}", twice!(21));
}
```

21 added to itself is 42.

### Call println from the macro

The expanded tokens must be valid Rust.

```rust run expect="copperkey" title="Print from a macro"
macro_rules! say {
    ($word:expr) => {
        println!("{}", $word);
    };
}

fn main() {
    say!("copperkey");
}
```

The terminal receives `copperkey`.

### A custom derive macro is not loaded

A procedural macro named in `derive` needs a dynamic library. Built-in `Debug` sometimes works. An external procedural macro does not.

```rust norun title="No proc macro"
fn main() {
    println!("no proc macros here");
}
```
