---
language: rust
chapter: 11
title: "Rust 迭代器"
level: beginner
minutes: 8
goals:
  - "用 iter 求和"
  - "用 map 变换"
  - "用 filter 留下偶数"
sources:
  - runoob-rust
updated: "2026-10-16"
---
迭代器一次看一个元素。求和、变换、筛选都靠适配器接在后面。

### 直接求和

`sum` 需要知道结果类型。

```rust run expect="42" title="三数之和"
fn main() {
    let nums = [2, 16, 24];
    let total: i32 = nums.iter().sum();
    println!("{total}");
}
```
三个元素加出 42。

### map 再收集

`collect` 要写目标类型，否则推断可能失败。

```rust run expect="10" title="中间那项翻倍"
fn main() {
    let nums = [3, 5, 7];
    let doubled: Vec<i32> = nums.iter().map(|n| n * 2).collect();
    println!("{}", doubled[1]);
}
```
5 的两倍是 10，它在下标 1。

### 只留偶数

`filter` 留下闭包返回真的元素。

```rust run expect="6" title="偶数相加"
fn main() {
    let nums = [1, 2, 3, 4];
    let even: i32 = nums.iter().copied().filter(|n| n % 2 == 0).sum();
    println!("{even}");
}
```
2 与 4 相加得 6。
