---
language: rust
chapter: 30
title: "Rust iterator adapters"
level: intermediate
minutes: 9
goals:
  - "Double 1 through 3 with map and sum"
  - "Count values greater than 3 with filter"
  - "Add three numbers with fold"
sources:
  - rust-by-example
updated: "2026-10-20"
---

An adapter returns another iterator and does not compute yet. sum, count, and fold are what actually walk the chain. Write the result type on let when it cannot be inferred from an empty closure.

### Sum after doubling

(1..=3) yields 1, 2, and 3. map multiplies each by 2, producing 2, 4, and 6. sum needs i32, and the total is 12.

```rust run expect="12" title="2 plus 4 plus 6"
fn main() {
    let n: i32 = (1..=3).map(|x| x * 2).sum();
    println!("{n}");
}
```

### Two values are greater than 3

Among 1 through 5, the values greater than 3 are 4 and 5. filter keeps them and count is 2.

```rust run expect="2" title="Keep two"
fn main() {
    let n = (1..=5).filter(|x| *x > 3).count();
    println!("{n}");
}
```

### fold starts at 0

The fold seed is 0, then 1, 2, and 4 are added. The closure receives the running total and the current item, and the print is 7.

```rust run expect="7" title="Fold to 7"
fn main() {
    let n: i32 = [1, 2, 4].iter().fold(0, |acc, x| acc + x);
    println!("{n}");
}
```

### Skip the first, then add

skip(1) drops 9 and leaves 1 and 2. Their sum is 3. Adapters can follow other adapters.

```rust run expect="3" title="Drop 9"
fn main() {
    let n: i32 = [9, 1, 2].iter().skip(1).sum();
    println!("{n}");
}
```
