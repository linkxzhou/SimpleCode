---
language: rust
chapter: 32
title: "Rust 问号与 Result"
level: intermediate
minutes: 9
goals:
  - "用问号把 Ok 里的 4 取出来"
  - "在错误分支打印 bad"
  - "让问号穿过两层函数"
sources:
  - rust-book
updated: "2026-10-20"
---

Result 把成功和失败分成两个变体。问号在 Ok 时取出值，在 Err 时从当前函数返回。当前函数的错误类型必须和问号左边的错误对得上。这里用同一种静态字符串。

### 成功时得到 5

parse 看到 4 就返回 Ok。load 用问号取出 4，再加 1。main 里 unwrap 打印 5。

```rust run expect="5" title="4 再加 1"
fn parse(text: &str) -> Result<i32, &'static str> {
    if text == "4" { Ok(4) } else { Err("bad") }
}
fn load() -> Result<i32, &'static str> {
    let n = parse("4")?;
    Ok(n + 1)
}
fn main() {
    println!("{}", load().unwrap());
}
```

### 失败时打印 bad

文本是 x，parse 返回 Err。match 不调用 unwrap，所以不会恐慌，终端看到 bad。

```rust run expect="bad" title="错误文本"
fn parse(text: &str) -> Result<i32, &'static str> {
    if text == "4" { Ok(4) } else { Err("bad") }
}
fn main() {
    match parse("x") {
        Ok(v) => println!("{v}"),
        Err(msg) => println!("{msg}"),
    }
}
```

### 两层都用问号

outer 调用 inner，inner 再调用 parse。任意一层的 Err 都会停掉后面的加法。这里输入是 4，所以两层都成功，打印 6。

```rust run expect="6" title="加两次"
fn parse(text: &str) -> Result<i32, &'static str> {
    if text == "4" { Ok(4) } else { Err("bad") }
}
fn inner() -> Result<i32, &'static str> {
    let n = parse("4")?;
    Ok(n + 1)
}
fn outer() -> Result<i32, &'static str> {
    let n = inner()?;
    Ok(n + 1)
}
fn main() {
    println!("{}", outer().unwrap());
}
```

### 空字符串也是错误

练习把空字符串交给 parse。它不是 4，match 的错误分支打印 bad。

```rust run expect="bad" title="空文本"
fn parse(text: &str) -> Result<i32, &'static str> {
    if text == "4" { Ok(4) } else { Err("bad") }
}
fn main() {
    match parse("") {
        Ok(v) => println!("{v}"),
        Err(msg) => println!("{msg}"),
    }
}
```
