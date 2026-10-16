---
language: rust
chapter: 25
title: "Rust 宏"
level: advanced
minutes: 8
goals:
  - "用 macro_rules 写声明宏"
  - "在 main 里展开它"
  - "知道过程宏加载不了"
sources:
  - runoob-rust
updated: "2026-10-16"
---
`println!` 就是宏。自己写的声明宏用 `macro_rules!`。过程宏要单独的 crate，这里没有。

### 把参数加两次

`$n:expr` 匹配一个表达式，展开两次。

```rust run expect="42" title="展开两次"
macro_rules! twice {
    ($n:expr) => {
        $n + $n
    };
}

fn main() {
    println!("{}", twice!(21));
}
```
21 加 21。

### 宏里调用 println

展开结果必须是合法的 Rust。

```rust run expect="铜钥匙" title="宏里打印"
macro_rules! say {
    ($word:expr) => {
        println!("{}", $word);
    };
}

fn main() {
    say!("铜钥匙");
}
```
终端看到铜钥匙。

### 派生过程宏不加载

`derive` 里自定义的过程宏需要动态库。内建的 `Debug` 有时能用，外部过程宏不行。

```rust norun title="不写过程宏"
fn main() {
    println!("过程宏不在这里");
}
```
