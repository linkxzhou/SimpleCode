---
language: rust
chapter: 7
title: "Rust 注释"
level: beginner
minutes: 8
goals:
  - "用双斜杠写行注释"
  - "用块注释隔开一段"
  - "确认注释不会变成输出"
sources:
  - runoob-rust
updated: "2026-10-16"
---
注释只给读代码的人看。编译时会被丢掉，不会变成字符串。

### 行尾注释

双斜杠后面直到行尾都忽略。

```rust run expect="42" title="注释在行尾"
fn main() {
    let fare = 42; // 单位是分
    println!("{fare}");
}
```
输出只有数字。

### 块注释

`/*` 到 `*/` 可以跨行。不要嵌得太深，读起来费劲。

```rust run expect="42" title="中间被注释掉"
fn main() {
    let fare = 40 + /* 纸袋 */ 2;
    println!("{fare}");
}
```
加法只看见 40 和 2。

### 注释不是字符串

把说明放进双引号，它就会被打印。注释则不会。

```rust run expect="this runs" title="只有一句生效"
fn main() {
    // println!("这句不执行");
    println!("this runs");
}
```
被注释的宏没有运行。
