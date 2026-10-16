---
language: rust
chapter: 2
title: "Rust Cargo"
level: beginner
minutes: 8
goals:
  - "Remember Cargo is outside the browser"
  - "Use const in place of a package name"
  - "Still enter through main"
sources:
  - runoob-rust
updated: "2026-10-16"
---

Cargo creates directories, fetches dependencies, and selects a target. This exercise has no Cargo, so extra crates cannot be added.

### Store the crate name in a constant

A desktop project keeps that name in `Cargo.toml`. A constant carries the same idea here.

```rust run expect="夜窗" title="Crate name constant"
fn main() {
    const CRATE: &str = "夜窗";
    println!("{CRATE}");
}
```

The printed name is `夜窗`.

### main is still the entry

There is no `src/main.rs` tree. Execution starts at the function `main`.

```rust run expect="入口在 main" title="Entry function"
fn main() {
    println!("入口在 main");
}
```

`入口在 main` is the first line after startup.

### cargo build is not executed

`cargo build` would search for a toolchain on the computer. The sample is there to read, and it is not executed.

```rust norun title="Do not run cargo"
fn main() {
    println!("cargo build");
}
```
