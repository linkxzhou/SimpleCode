---
language: rust
chapter: 10
title: "Rust 循环"
level: beginner
minutes: 8
goals:
  - "用 loop 加 break"
  - "用 while 看条件"
  - "用 for 走过区间"
sources:
  - runoob-rust
updated: "2026-10-16"
---
三种循环都能重复一段代码。要停下来，就改条件或 `break`。

### loop 里跳出

`loop` 本身不停，靠 `break` 离开。

```rust run expect="42" title="加到四十二"
fn main() {
    let mut n = 0;
    loop {
        n += 7;
        if n == 42 {
            break;
        }
    }
    println!("{n}");
}
```
加到 42 就停。

### while 看剩余

条件变假时循环结束。

```rust run expect="left0" title="减到零"
fn main() {
    let mut left = 3;
    while left > 0 {
        left -= 1;
    }
    println!("left{left}");
}
```
三次之后剩余是 0。

### for 走过闭区间

`1..=3` 包含两端。

```rust run expect="6" title="一加到三"
fn main() {
    let mut total = 0;
    for n in 1..=3 {
        total += n;
    }
    println!("{total}");
}
```
1、2、3 的和是 6。
