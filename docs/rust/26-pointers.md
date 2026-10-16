---
language: rust
chapter: 26
title: "Rust 智能指针"
level: advanced
minutes: 8
goals:
  - "用 Box 把数放进堆"
  - "用 Rc 共享一份文本"
  - "用 RefCell 在共享时修改"
sources:
  - runoob-rust
updated: "2026-10-16"
---
智能指针是拥有额外行为的结构体。`Box` 独占堆内存，`Rc` 在单线程里计数，`RefCell` 把借用检查推迟到运行时。

### Box 里的整数

解引用由 `println` 的格式化自动完成。

```rust run expect="42" title="堆上的票价"
fn main() {
    let fare = Box::new(42);
    println!("{fare}");
}
```
打印的是里面的 42，不是地址。

### 两份 Rc 指向同一文本

`Rc::clone` 只增加计数，不复制字符串的内容。

```rust run expect="船票2" title="两个所有者"
use std::rc::Rc;

fn main() {
    let ticket = Rc::new(String::from("船票"));
    let again = Rc::clone(&ticket);
    println!("{}{}", ticket, Rc::strong_count(&again));
}
```
文本还是船票，强引用数是 2。

### RefCell 允许稍后修改

运行时若同时存在可变借用，会 panic。这里先改完再读。

```rust run expect="42" title="稍后加上二十二"
use std::cell::RefCell;

fn main() {
    let fare = RefCell::new(20);
    *fare.borrow_mut() += 22;
    println!("{}", fare.borrow());
}
```
可变借用结束后才能再借用打印。
