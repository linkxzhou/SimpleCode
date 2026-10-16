---
language: rust
chapter: 23
title: "Rust 面向对象"
level: advanced
minutes: 8
goals:
  - "用特性描述行为"
  - "为结构体实现特性"
  - "用泛型函数调用特性方法"
sources:
  - runoob-rust
updated: "2026-10-16"
---
Rust 没有类继承。共享行为靠特性，数据放在结构体里。

### 特性只有一个方法

实现块给出这个方法的函数体。

```rust run expect="pass" title="门上的标签"
trait Tag {
    fn label(&self) -> &'static str;
}

struct Gate;

impl Tag for Gate {
    fn label(&self) -> &'static str {
        "pass"
    }
}

fn main() {
    println!("{}", Gate.label());
}
```
`Gate` 的标签是 `pass`。

### 另一个实现

同一特性可以挂到不同结构体上，方法体各写各的。

```rust run expect="fountain" title="笔的标签"
trait Tag {
    fn label(&self) -> &'static str;
}

struct Pen;

impl Tag for Pen {
    fn label(&self) -> &'static str {
        "fountain"
    }
}

fn main() {
    println!("{}", Pen.label());
}
```
这次打出 fountain。

### 泛型函数接收特性

`impl Tag` 表示任何实现了 Tag 的类型。

```rust run expect="window" title="函数接收特性"
trait Tag {
    fn label(&self) -> &'static str;
}

struct Gate;

impl Tag for Gate {
    fn label(&self) -> &'static str {
        "window"
    }
}

fn show(item: &impl Tag) {
    println!("{}", item.label());
}

fn main() {
    show(&Gate);
}
```
函数不写出具体结构体名，只要求有 `label`。
