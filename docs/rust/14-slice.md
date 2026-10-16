---
language: rust
chapter: 14
title: "Rust Slice"
level: intermediate
minutes: 8
goals:
  - "切出字符串的一段"
  - "切出数组的尾部"
  - "把切片传进函数"
sources:
  - runoob-rust
updated: "2026-10-16"
---
切片是对连续数据的借用，自己不拥有那块内存。下标按字节计，必须落在字符边界上。

### 字符串后半段

`night pass` 从第 6 个字节起是 `pass`。

```rust run expect="pass" title="后两个字"
fn main() {
    let word = String::from("night pass");
    println!("{}", &word[6..]);
}
```
前半段被切掉，剩下 `pass`。

### 数组的尾巴

范围 `1..` 从下标 1 一直到结束。

```rust run expect="42" title="尾部求和"
fn main() {
    let nums = [2, 19, 23];
    let tail = &nums[1..];
    let total: i32 = tail.iter().sum();
    println!("{total}");
}
```
19 与 23 相加。

### 函数接收切片

参数写成 `&[i32]`，数组和向量都能借出去。

```rust run expect="42" title="切片参数"
fn total(part: &[i32]) -> i32 {
    part.iter().sum()
}

fn main() {
    let nums = [10, 32];
    println!("{}", total(&nums));
}
```
函数里看不到原来的数组名，只看见这一段。
