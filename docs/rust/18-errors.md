---
language: rust
chapter: 18
title: "Rust 错误处理"
level: intermediate
minutes: 8
goals:
  - "用 Result 返回解析结果"
  - "用问号提前返回错误"
  - "用 unwrap_or 给默认值"
sources:
  - runoob-rust
updated: "2026-10-16"
---
可恢复的失败用 `Result`。真的 `panic!` 会中止进程，因为编译选项是 panic=abort。

### 解析成功

`parse` 失败时类型是 `ParseIntError`，成功则是数字。

```rust run expect="42" title="解析四十二"
fn cents(text: &str) -> Result<i32, std::num::ParseIntError> {
    text.parse()
}

fn main() {
    println!("{}", cents("42").unwrap());
}
```
字符串里全是数字，所以成功。

### 问号把错误交出去

`?` 在 `Err` 时立刻返回，成功则取出里面的值。

```rust run expect="42" title="解析后翻倍"
fn double(text: &str) -> Result<i32, std::num::ParseIntError> {
    let n: i32 = text.parse()?;
    Ok(n * 2)
}

fn main() {
    println!("{}", double("21").unwrap());
}
```
21 变成 42。

### 失败时用默认

不要对肯定会失败的解析调用 `unwrap`，否则程序中止。

```rust run expect="0" title="解析失败给零"
fn main() {
    let bad = "stub".parse::<i32>().unwrap_or(0);
    println!("{bad}");
}
```
汉字不是整数，结果用 0。
