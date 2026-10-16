---
language: rust
chapter: 13
title: "Rust 所有权"
level: intermediate
minutes: 8
goals:
  - "克隆字符串再使用"
  - "整数复制不移动"
  - "把所有权交进函数"
sources:
  - runoob-rust
updated: "2026-10-16"
---
`String` 默认移动。移动之后原来的名字不能再读。整数实现了 `Copy`，传递时是复制。

### 克隆后两边都能读

`clone` 做出另一份堆上的文本。

```rust run expect="船票船票" title="两份船票"
fn main() {
    let ticket = String::from("船票");
    let copy = ticket.clone();
    println!("{ticket}{copy}");
}
```
原件和副本都还在。

### 整数可以继续用

函数拿走的是副本，调用方的绑定还在。

```rust run expect="4242" title="复制整数"
fn give(n: i32) -> i32 {
    n
}

fn main() {
    let cents = 42;
    let again = give(cents);
    println!("{cents}{again}");
}
```
两个 42 贴在一起。

### 把字符串交出去

函数参数获得所有权后，调用方就不要再碰那个名字。

```rust run expect="周票" title="所有权移交"
fn hold(ticket: String) -> String {
    ticket
}

fn main() {
    let ticket = String::from("周票");
    let kept = hold(ticket);
    println!("{kept}");
}
```
打印用的是函数返回的那一份。
