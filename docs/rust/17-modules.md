---
language: rust
chapter: 17
title: "Rust 组织管理"
level: intermediate
minutes: 8
goals:
  - "在同一文件里写 mod"
  - "用 pub 放出函数"
  - "写出嵌套模块"
sources:
  - runoob-rust
updated: "2026-10-16"
---
模块用来把名字分组。这个练习场只有一个文件，模块都写在 main.rs 里面，不要再 `mod` 另一个文件。

### 窗口模块

`pub` 的函数才能从模块外调用。

```rust run expect="42" title="模块里的票价"
mod window {
    pub fn fare() -> i32 {
        42
    }
}

fn main() {
    println!("{}", window::fare());
}
```
路径用双冒号。

### 嵌套抽屉

子模块继续用 `pub` 把更里面的函数放出来。

```rust run expect="铜钥匙" title="两层路径"
mod desk {
    pub mod drawer {
        pub fn key() -> &'static str {
            "铜钥匙"
        }
    }
}

fn main() {
    println!("{}", desk::drawer::key());
}
```
从根一直点到 `key`。

### 公开的结构体

字段也要 `pub`，外面才能读写。

```rust run expect="夜班" title="公开字段"
mod counter {
    pub struct Shift {
        pub name: &'static str,
    }
}

fn main() {
    let shift = counter::Shift { name: "夜班" };
    println!("{}", shift.name);
}
```
结构体和字段都公开了。
