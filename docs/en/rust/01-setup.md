---
language: rust
chapter: 1
title: "Rust Environment Setup"
level: beginner
minutes: 8
goals:
  - "Select Rust from the sidebar"
  - "Wait until the toolchain finishes"
  - "Edit only one main.rs"
sources:
  - runoob-rust
updated: "2026-10-16"
---

The first visit to Rust in the sidebar downloads the compiler and the unpacked standard library. The progress bar follows unpacked bytes, about 152 MB.

### Run after the download

Run can compile the editor buffer only after that download ends.

```rust run expect="Night window open" title="Window opened"
fn main() {
    println!("Night window open");
}
```

`Night window open` means this hello program compiled.

### The file name is fixed

The editor tab is `main.rs`. A local rustup install is unnecessary.

```rust run expect="only this source" title="Single file"
fn main() {
    println!("only this source");
}
```

`only this source` confirms the current buffer is the source sent to rustc.

### A desktop hint

The sidebar marks this build as a desktop experiment. A phone may lack memory for the compiler.

```rust run expect="desktop browser" title="Desktop reminder"
fn main() {
    println!("Open this in a desktop browser");
}
```

The program prints `Open this in a desktop browser`.
