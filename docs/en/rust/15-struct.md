---
language: rust
chapter: 15
title: "Rust Structs"
level: intermediate
minutes: 8
goals:
  - "Define a struct with fields"
  - "Read a field through a method"
  - "Build a new value by updating fields"
sources:
  - runoob-rust
updated: "2026-10-16"
---

A struct groups related fields under one name. Methods belong in an `impl` block.

### Read one field

Every field needs a value when the struct is built.

```rust run expect="42" title="Field fare"
struct Ticket {
    cents: i32,
}

fn main() {
    let ticket = Ticket { cents: 42 };
    println!("{}", ticket.cents);
}
```

The dot operator reads `cents`, which is 42.

### A method doubles the value

`&self` borrows the struct. It does not take ownership.

```rust run expect="42" title="Method doubles"
struct Ticket {
    cents: i32,
}

impl Ticket {
    fn double(&self) -> i32 {
        self.cents * 2
    }
}

fn main() {
    let ticket = Ticket { cents: 21 };
    println!("{}", ticket.double());
}
```

`double` computes twice 21, which is 42.

### Struct update syntax

`..desk` copies every field you did not write. Only the fare changes. The window number stays as it was.

```rust run expect="42" title="Change only the fare"
struct Desk {
    window: i32,
    fare: i32,
}

fn main() {
    let desk = Desk { window: 1, fare: 10 };
    let next = Desk { fare: 42, ..desk };
    println!("{}", next.fare);
}
```

The fare on the new desk is 42. The window number remains 1, and that field is not printed.
