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

```rust run expect="夜班窗口已开" title="Window opened"
fn main() {
    println!("夜班窗口已开");
}
```

`夜班窗口已开` means this hello program compiled.

### The file name is fixed

The editor tab is `main.rs`. A local rustup install is unnecessary.

```rust run expect="只有这一份源码" title="Single file"
fn main() {
    println!("只有这一份源码");
}
```

`只有这一份源码` confirms the current buffer is the source sent to rustc.

### A desktop hint

The sidebar marks this build as a desktop experiment. A phone may lack memory for the compiler.

```rust run expect="桌面浏览器" title="Desktop reminder"
fn main() {
    println!("请在桌面浏览器打开");
}
```

The program prints `请在桌面浏览器打开`.
