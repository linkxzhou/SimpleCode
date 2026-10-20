---
language: rust
chapter: 31
title: "Rust Box, Rc, and RefCell"
level: advanced
minutes: 10
goals:
  - "Put an integer on the heap with Box"
  - "Read the strong count after a clone"
  - "Change a value through RefCell on an immutable binding"
sources:
  - rust-book
updated: "2026-10-20"
---

Box owns a heap value exclusively. Rc gives one value several owners, but only shared reads. RefCell moves the borrow check to run time, so an immutable binding can still borrow_mut. A mutable borrow overlapping another borrow panics, and that pattern is reading-only.

### 4 on the heap

Box::new(4) places the integer on the heap. Dereferencing it prints 4. When the Box leaves scope it frees that memory.

```rust run expect="4" title="Dereference"
fn main() {
    let boxed = Box::new(4);
    println!("{}", *boxed);
}
```

### The strong count becomes 2

Rc::new starts the count at 1. clone adds an owner, so strong_count becomes 2. That is not a deep copy of the 7.

```rust run expect="2" title="Two owners"
use std::rc::Rc;
fn main() {
    let value = Rc::new(7);
    let _copy = Rc::clone(&value);
    println!("{}", Rc::strong_count(&value));
}
```

### Borrow at run time

The cell binding itself is immutable. borrow_mut lends out the inner 1, and adding 3 makes it 4. Only this one mutable borrow exists at that moment.

```rust run expect="4" title="Change to 4"
use std::cell::RefCell;
fn main() {
    let cell = RefCell::new(1);
    *cell.borrow_mut() += 3;
    println!("{}", *cell.borrow());
}
```

### Length inside a box

A Box can also hold the string tea. len counts bytes, and three letters are 3.

```rust run expect="3" title="Three bytes"
fn main() {
    let word = Box::new(String::from("tea"));
    println!("{}", word.len());
}
```

### Overlapping borrows panic

borrow followed by borrow_mut panics at run time. Do not put that order in a runnable block. End the first borrow before a shared write.

```rust norun title="Do not run"
let cell = RefCell::new(1);
let _keep = cell.borrow();
let _edit = cell.borrow_mut();
```
