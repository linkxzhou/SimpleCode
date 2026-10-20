---
language: rust
chapter: 33
title: "Rust 模式进阶"
level: intermediate
minutes: 9
goals:
  - "用守卫比较一对整数"
  - "用切片模式取出第一个元素"
  - "用或模式接住两个枚举变体"
sources:
  - rust-by-example
updated: "2026-10-20"
---

模式不只是枚举分支。守卫可以在结构已经匹配之后再判断条件。切片模式能拆开数组的头和剩余部分。或模式用竖线把几个变体合成一支。

### 守卫看到 1 小于 2

元组 (1, 2) 先按形状匹配，守卫 a < b 再决定走这一支。打印的是第二个数 2。

```rust run expect="2" title="较小的一对"
fn main() {
    match (1, 2) {
        (a, b) if a < b => println!("{b}"),
        _ => println!("no"),
    }
}
```

### 数组的头是 9

[first, ..] 把第一个元素绑到 first，其余不关心。数组是 9、1、2，所以打印 9。

```rust run expect="9" title="第一个元素"
fn main() {
    let xs = [9, 1, 2];
    match xs {
        [first, ..] => println!("{first}"),
    }
}
```

### 两个变体同一支

Coin::Used 和 Coin::Lost 都走到打印 0 的分支。Held(4) 会走到另一支并打印 4。这里构造的是 Used。

```rust run expect="0" title="用过的硬币"
enum Coin { Held(i32), Used, Lost }
fn main() {
    let coin = Coin::Used;
    match coin {
        Coin::Held(n) => println!("{n}"),
        Coin::Used | Coin::Lost => println!("0"),
    }
}
```

### 持有的面值

练习改成 Held(4)。这一支把里面的整数打印出来，结果是 4。

```rust run expect="4" title="面值 4"
enum Coin { Held(i32), Used, Lost }
fn main() {
    let coin = Coin::Held(4);
    match coin {
        Coin::Held(n) => println!("{n}"),
        Coin::Used | Coin::Lost => println!("0"),
    }
}
```
