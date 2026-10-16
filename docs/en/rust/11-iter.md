---
language: rust
chapter: 11
title: "Rust Iterators"
level: beginner
minutes: 8
goals:
  - "Sum with iter"
  - "Transform with map"
  - "Keep even numbers with filter"
sources:
  - runoob-rust
updated: "2026-10-16"
---

An iterator yields one element at a time. Summing, mapping, and filtering are adapters chained after it.

### Sum directly

`sum` has to be told the result type.

```rust run expect="42" title="Sum of three numbers"
fn main() {
    let nums = [2, 16, 24];
    let total: i32 = nums.iter().sum();
    println!("{total}");
}
```

2, 16, and 24 total 42.

### map, then collect

Give `collect` a target type, or inference may fail.

```rust run expect="10" title="Double the middle item"
fn main() {
    let nums = [3, 5, 7];
    let doubled: Vec<i32> = nums.iter().map(|n| n * 2).collect();
    println!("{}", doubled[1]);
}
```

Twice 5 is 10, and that value sits at index 1.

### Keep only even numbers

`filter` retains items whose closure returns true.

```rust run expect="6" title="Add the evens"
fn main() {
    let nums = [1, 2, 3, 4];
    let even: i32 = nums.iter().copied().filter(|n| n % 2 == 0).sum();
    println!("{even}");
}
```

2 and 4 remain. Their sum is 6.
