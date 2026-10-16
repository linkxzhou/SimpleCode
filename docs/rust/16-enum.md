---
language: rust
chapter: 16
title: "Rust 枚举"
level: intermediate
minutes: 8
goals:
  - "用 match 区分变体"
  - "用 Option 表示可能缺失"
  - "用 if let 只看一种"
sources:
  - runoob-rust
updated: "2026-10-16"
---
枚举的每个变体是一种可能。`match` 必须写全，否则编译失败。

### 窗口开或关

两个不带数据的变体就够描述开关。

```rust run expect="开着" title="匹配开"
enum Gate {
    Open,
    Shut,
}

fn main() {
    let gate = Gate::Open;
    let word = match gate {
        Gate::Open => "开着",
        Gate::Shut => "关着",
    };
    println!("{word}");
}
```
当前变体是 Open。

### Option 里的数

`Some` 装着值，`None` 表示没有。`unwrap_or` 在没有时给默认。

```rust run expect="42" title="有票价"
fn main() {
    let fare: Option<i32> = Some(42);
    println!("{}", fare.unwrap_or(0));
}
```
有值时不会用到 0。

### if let 只展开一种

不关心其他变体时，用 `if let` 少写几支。

```rust run expect="42" title="只看 Some"
fn main() {
    let fare = Some(42);
    if let Some(n) = fare {
        println!("{n}");
    }
}
```
匹配成功才打印里面的数。
