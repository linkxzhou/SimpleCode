---
language: rust
chapter: 36
title: "Rust unsafe basics"
level: advanced
minutes: 9
goals:
  - "Read a local integer through a raw pointer"
  - "Change 1 into 6 through a mutable raw pointer"
  - "Know that dereferencing a null pointer must not run"
sources:
  - rust-book
updated: "2026-10-20"
---

An unsafe block permits dereferencing a raw pointer. It does not turn off the rest of the borrow rules. The pointer must aim at a value that is still alive. Null and dangling pointers are undefined behavior and stay in reading blocks.

### Read the local 4

n lives in main. After the reference becomes *const i32, the unsafe block dereferences it and prints 4.

```rust run expect="4" title="Raw read"
fn main() {
    let n = 4;
    let p = &n as *const i32;
    unsafe {
        println!("{}", *p);
    }
}
```

### Write 6

The mutable raw pointer comes from &mut slot. Inside unsafe, 1 becomes 6, then the safe binding prints it. No other reference exists during the write.

```rust run expect="6" title="Raw write"
fn main() {
    let mut slot = 1;
    let p = &mut slot as *mut i32;
    unsafe {
        *p = 6;
    }
    println!("{slot}");
}
```

### Sum of two slots

The exercise takes two raw pointers from an array, reads 2 and 5, and prints their sum 7. The array stays alive until the print finishes.

```rust run expect="7" title="Add through pointers"
fn main() {
    let xs = [2, 5];
    let p = xs.as_ptr();
    unsafe {
        println!("{}", *p + *p.add(1));
    }
}
```

### Do not dereference null

null does not point at any live integer. Dereferencing it is undefined behavior and can trap in wasm. This fragment only names the hazard and is not executed.

```rust norun title="Do not run"
let p: *const i32 = std::ptr::null();
unsafe {
    println!("{}", *p);
}
```
