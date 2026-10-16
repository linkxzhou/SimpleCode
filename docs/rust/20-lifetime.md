---
language: rust
chapter: 20
title: "Rust 生命周期"
level: intermediate
minutes: 8
goals:
  - "给两个借用标上同一生命周期"
  - "返回其中的一个借用"
  - "返回静态字符串"
sources:
  - runoob-rust
updated: "2026-10-16"
---
借用不能活得比它指向的数据更久。生命周期标注告诉编译器这些借用的关系，不改变运行时。

### 返回先出现的那个

两个参数共用 `'a`，返回值也不能比它们活得更久。

```rust run expect="船票" title="返回左边"
fn earlier<'a>(left: &'a str, _right: &'a str) -> &'a str {
    left
}

fn main() {
    let ticket = String::from("船票");
    let pen = String::from("钢笔");
    println!("{}", earlier(&ticket, &pen));
}
```
返回的切片仍然指向 `ticket`。

### 两个本地字符串都活到打印之后

调用发生在两个 `String` 都还在的时候，所以借用有效。

```rust run expect="开窗" title="按标志挑选"
fn pick<'a>(open: bool, yes: &'a str, no: &'a str) -> &'a str {
    if open { yes } else { no }
}

fn main() {
    let yes = String::from("开窗");
    let no = String::from("关窗");
    println!("{}", pick(true, &yes, &no));
}
```
真就返回第一段文本。

### 静态生命周期

字面量存在整个程序期间，可以标成 `'static`。

```rust run expect="窗口" title="静态窗口"
fn label() -> &'static str {
    "窗口"
}

fn main() {
    println!("{}", label());
}
```
没有局部变量需要活过这个调用。
