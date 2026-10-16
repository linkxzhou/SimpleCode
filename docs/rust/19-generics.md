---
language: rust
chapter: 19
title: "Rust 泛型与特性"
level: intermediate
minutes: 8
goals:
  - "写出类型参数"
  - "给参数加特性约束"
  - "为类型实现特性"
sources:
  - runoob-rust
updated: "2026-10-16"
---
泛型把类型留到调用时再定。特性描述这些类型必须会做的事。

### 原样返回

函数不关心 T 具体是什么。

```rust run expect="42" title="泛型原样返回"
fn keep<T>(value: T) -> T {
    value
}

fn main() {
    println!("{}", keep(42));
}
```
调用处把 T 定成 i32。

### 要求能打印

约束写在尖括号里，函数体才能用 `{}`。

```rust run expect="nightwin" title="可打印的泛型"
fn show<T: std::fmt::Display>(value: T) -> String {
    format!("{value}")
}

fn main() {
    println!("{}", show("nightwin"));
}
```
`&str` 实现了 Display。

### 为自己的类型实现

特性里的方法，实现块必须全部给出。

```rust run expect="42" title="夜班票价特性"
trait Fare {
    fn cents(&self) -> i32;
}

struct Night;

impl Fare for Night {
    fn cents(&self) -> i32 {
        42
    }
}

fn main() {
    println!("{}", Night.cents());
}
```
`Night` 因此有了 `cents`。
