---
language: rust
chapter: 6
title: "Rust 数据类型"
level: beginner
minutes: 8
goals:
  - "写出 i32 与 u32"
  - "使用布尔值"
  - "区分字符和字符串"
sources:
  - runoob-rust
updated: "2026-10-16"
---
编译器要在编译期知道每个名字的类型。字面量多数能推断，必要时写上注解。

### 有符号和无符号

`i32` 能表示负数。`u32` 只表示非负，这里用一个正数。

```rust run expect="42" title="付掉欠款"
fn main() {
    let owed: i32 = -3;
    let paid: u32 = 45;
    println!("{}", paid as i32 + owed);
}
```
45 减 3 等于 42。

### 布尔决定词

`if` 的条件必须是 `bool`，不能拿整数充数。

```rust run expect="on" title="窗口开着"
fn main() {
    let open: bool = true;
    let word = if open { "on" } else { "off" };
    println!("{word}");
}
```
真对应开。

### 一个字符和一串字

`char` 用单引号，里面是一个 Unicode 标量。`&str` 用双引号。

```rust run expect="window" title="拼成窗口"
fn main() {
    let mark: char = 'pane';
    let name: &str = "slot";
    println!("{mark}{name}");
}
```
字符和字符串切片接在一起。
