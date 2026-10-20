---
language: rust
chapter: 33
title: "Rust patterns in more detail"
level: intermediate
minutes: 9
goals:
  - "Compare a pair with a match guard"
  - "Take the first element with a slice pattern"
  - "Catch two enum variants with an or pattern"
sources:
  - rust-by-example
updated: "2026-10-20"
---

Patterns are more than enum arms. A guard tests a condition after the shape already matches. A slice pattern splits the head of an array from the rest. An or pattern joins several variants into one arm with a bar.

### The guard sees that 1 is less than 2

The tuple (1, 2) matches by shape first, then the guard a < b chooses this arm. The print is the second number, 2.

```rust run expect="2" title="The smaller pair"
fn main() {
    match (1, 2) {
        (a, b) if a < b => println!("{b}"),
        _ => println!("no"),
    }
}
```

### The head of the array is 9

[first, ..] binds the first element to first and ignores the rest. The array is 9, 1, 2, so the print is 9.

```rust run expect="9" title="First element"
fn main() {
    let xs = [9, 1, 2];
    match xs {
        [first, ..] => println!("{first}"),
    }
}
```

### Two variants, one arm

Coin::Used and Coin::Lost share the arm that prints 0. Held(4) would take the other arm and print 4. This program builds Used.

```rust run expect="0" title="A used coin"
enum Coin { Held(i32), Used, Lost }
fn main() {
    let coin = Coin::Used;
    match coin {
        Coin::Held(n) => println!("{n}"),
        Coin::Used | Coin::Lost => println!("0"),
    }
}
```

### The held face value

The exercise switches to Held(4). That arm prints the integer inside, and the result is 4.

```rust run expect="4" title="Face value 4"
enum Coin { Held(i32), Used, Lost }
fn main() {
    let coin = Coin::Held(4);
    match coin {
        Coin::Held(n) => println!("{n}"),
        Coin::Used | Coin::Lost => println!("0"),
    }
}
```
