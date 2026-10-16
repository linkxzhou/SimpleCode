---
language: rust
chapter: 15
title: "Rust 结构体"
level: intermediate
minutes: 8
goals:
  - "定义带字段的结构体"
  - "用方法读字段"
  - "按字段更新出新值"
sources:
  - runoob-rust
updated: "2026-10-16"
---
结构体把相关字段放在一个名字下。方法写在 `impl` 块里。

### 读一个字段

构造时每个字段都要给值。

```rust run expect="42" title="字段票价"
struct Ticket {
    cents: i32,
}

fn main() {
    let ticket = Ticket { cents: 42 };
    println!("{}", ticket.cents);
}
```
点号取出 cents。

### 方法翻倍

`&self` 表示只借用，不拿走结构体。

```rust run expect="42" title="方法翻倍"
struct Ticket {
    cents: i32,
}

impl Ticket {
    fn double(&self) -> i32 {
        self.cents * 2
    }
}

fn main() {
    let ticket = Ticket { cents: 21 };
    println!("{}", ticket.double());
}
```
21 的两倍由方法算出来。

### 结构更新

`..desk` 抄来没写的字段。这里只改票价，窗口号留着原来的。

```rust run expect="42" title="只改票价"
struct Desk {
    window: i32,
    fare: i32,
}

fn main() {
    let desk = Desk { window: 1, fare: 10 };
    let next = Desk { fare: 42, ..desk };
    println!("{}", next.fare);
}
```
新柜台的票价是 42，窗口号仍是 1。
