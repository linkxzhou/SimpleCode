---
language: rust
chapter: 26
title: "Rust Smart Pointers"
level: advanced
minutes: 8
goals:
  - "Put a number on the heap with Box"
  - "Share one text value with Rc"
  - "Mutate shared data with RefCell"
sources:
  - runoob-rust
updated: "2026-10-16"
---

A smart pointer is a struct with extra behavior. `Box` owns one heap allocation. `Rc` counts owners on a single thread. `RefCell` delays the borrow check until runtime.

### An integer inside Box

Formatting in `println` dereferences the box for you.

```rust run expect="42" title="Fare on the heap"
fn main() {
    let fare = Box::new(42);
    println!("{fare}");
}
```

The printed value is the inner 42, not an address.

### Two Rc handles share one text

`Rc::clone` increases the strong count. It does not copy the string bytes.

```rust run expect="pass2" title="Two owners"
use std::rc::Rc;

fn main() {
    let ticket = Rc::new(String::from("pass"));
    let again = Rc::clone(&ticket);
    println!("{}{}", ticket, Rc::strong_count(&again));
}
```

The text is still `pass` and the strong count is 2, so the line is `pass2`.

### RefCell allows a later write

A second mutable borrow at the same time panics at runtime. This sample finishes the write before it reads.

```rust run expect="42" title="Add twenty-two later"
use std::cell::RefCell;

fn main() {
    let fare = RefCell::new(20);
    *fare.borrow_mut() += 22;
    println!("{}", fare.borrow());
}
```

The mutable borrow ends, then `borrow` can print the result, 42.
