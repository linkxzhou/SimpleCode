---
language: rust
chapter: 12
title: "Rust 闭包"
level: beginner
minutes: 8
goals:
  - "写出带参数的闭包"
  - "捕获外面的绑定"
  - "把闭包交给 filter"
sources:
  - runoob-rust
updated: "2026-10-16"
---
闭包是可以存起来的匿名函数。参数写在竖线中间。

### 加一个固定数

调用方式和普通函数一样。

```rust run expect="42" title="闭包相加"
fn main() {
    let add = |n: i32| n + 19;
    println!("{}", add(23));
}
```
23 再加 19 等于 42。

### 捕获票价

闭包读到了外层的 `fare`。

```rust run expect="42" title="捕获后翻倍"
fn main() {
    let fare = 21;
    let double = || fare * 2;
    println!("{}", double());
}
```
没有参数，用的是外面的 21。

### 当作谓词

`filter` 接受一个闭包。

```rust run expect="1" title="数出四十二"
fn main() {
    let fares = [8, 42, 3];
    let hit = fares.iter().copied().filter(|n| *n == 42).count();
    println!("{hit}");
}
```
只有一项等于 42。
