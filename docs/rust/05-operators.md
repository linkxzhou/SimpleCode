---
language: rust
chapter: 5
title: "Rust 运算符"
level: beginner
minutes: 8
goals:
  - "做加减乘"
  - "比较两个数"
  - "用逻辑与组合条件"
sources:
  - runoob-rust
updated: "2026-10-16"
---
整数运算和比较都写在表达式里。比较的结果是 `bool`。

### 票价相乘

`*` 的优先级高于 `+`，这里用括号把加法先算完。

```rust run expect="42" title="先加后乘"
fn main() {
    let fare = (20 + 1) * 2;
    println!("{fare}");
}
```
结果是 42。

### 比较是否相等

`==` 比较值，不修改两边。

```rust run expect="true" title="两个十八"
fn main() {
    let same = 18 == 18;
    println!("{same}");
}
```
相等时打出 true。

### 两个条件都要成立

`&&` 两边都为真，整个表达式才为真。

```rust run expect="true" title="开着并且已付"
fn main() {
    let open = true;
    let paid = true;
    println!("{}", open && paid);
}
```
两个都真，输出 true。
