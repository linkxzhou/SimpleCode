---
language: rust
chapter: 4
title: "Rust 基础语法"
level: beginner
minutes: 8
goals:
  - "用 let 绑定名字"
  - "用 mut 修改绑定"
  - "让新绑定遮住旧名字"
sources:
  - runoob-rust
updated: "2026-10-16"
---
一条语句以分号结束。`let` 绑定默认不能改，要改就写 `mut`。

### 绑定一个数

名字 `fare` 在 `main` 里可见。

```rust run expect="42" title="绑定票价"
fn main() {
    let fare = 42;
    println!("{fare}");
}
```
打出的就是这个绑定。

### 可变绑定

`mut` 之后才能用 `+=`。

```rust run expect="42" title="加上二十二"
fn main() {
    let mut fare = 20;
    fare += 22;
    println!("{fare}");
}
```
加完是 42。

### 遮住旧名字

同一名字再次 `let`，后面的代码只看见新值。

```rust run expect="newwin" title="后来的名字"
fn main() {
    let label = "oldwin";
    let label = "newwin";
    println!("{label}");
}
```
旧窗不会出现在输出里。
