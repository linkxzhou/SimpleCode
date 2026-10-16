---
language: rust
chapter: 17
title: "Rust Modules"
level: intermediate
minutes: 8
goals:
  - "Write mod in the same file"
  - "Expose a function with pub"
  - "Write a nested module"
sources:
  - runoob-rust
updated: "2026-10-16"
---

Modules group names. This exercise is one file, so every module stays inside `main.rs`. Do not `mod` a second file.

### A module named window

Only a `pub` function can be called from outside its module.

```rust run expect="42" title="Fare inside a module"
mod window {
    pub fn fare() -> i32 {
        42
    }
}

fn main() {
    println!("{}", window::fare());
}
```

The path uses `::`, and `fare` returns 42.

### A nested module

The child module also needs `pub` if a function deeper inside should be reachable.

```rust run expect="铜钥匙" title="Two-level path"
mod desk {
    pub mod drawer {
        pub fn key() -> &'static str {
            "铜钥匙"
        }
    }
}

fn main() {
    println!("{}", desk::drawer::key());
}
```

The path runs from the crate root to `key` and prints `铜钥匙`.

### A public struct

Fields need `pub` too, or code outside the module cannot read or write them.

```rust run expect="夜班" title="Public field"
mod counter {
    pub struct Shift {
        pub name: &'static str,
    }
}

fn main() {
    let shift = counter::Shift { name: "夜班" };
    println!("{}", shift.name);
}
```

Both the struct and the field are public. The name prints as `夜班`.
