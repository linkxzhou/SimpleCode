---
language: rust
chapter: 8
title: "Rust 函数"
level: beginner
minutes: 8
goals:
  - "写出带参数的函数"
  - "用最后一个表达式当返回值"
  - "在 main 里调用"
sources:
  - runoob-rust
updated: "2026-10-16"
---
函数用 `fn` 声明。参数和返回值的类型都要写出来。

### 传入两个票价

调用时按参数顺序传值。

```rust run expect="42" title="相加函数"
fn add(left: i32, right: i32) -> i32 {
    left + right
}

fn main() {
    println!("{}", add(19, 23));
}
```
19 与 23 之和是 42。没有分号的那一行就是返回值。

### 早一点返回

`return` 可以在中间离开函数。

```rust run expect="openwin" title="提前返回"
fn label(open: bool) -> &'static str {
    if open {
        return "openwin";
    }
    "shutwin"
}

fn main() {
    println!("{}", label(true));
}
```
条件成立时走 `return`。

### 无返回值

省略返回类型时，函数结果是单元值，通常只做打印。

```rust run expect="callfirst" title="只打印"
fn shout(name: &str) {
    println!("call{name}");
}

fn main() {
    shout("first");
}
```
`shout` 自己负责输出。
