---
language: rust
chapter: 37
title: "Rust 小命令解析"
level: intermediate
minutes: 10
goals:
  - "从参数里读出 --qty 后面的数"
  - "缺少标志时返回 0"
  - "数出成对标志的个数"
sources:
  - rust-book
  - rust-by-example
updated: "2026-10-20"
---

这个小项目只解析字符串切片，不读取真实的进程参数。环境变量和命令行在浏览器里没有一份稳定的 argv 教学接口，所以参数直接写在数组里。解析失败时用 0，而不是恐慌。

### 读出数量 4

flag 找到 --qty 后把下一个格子解析成整数。数组里是 4，打印 4。

```rust run expect="4" title="数量标志"
fn flag(args: &[&str], name: &str) -> i32 {
    let mut i = 0;
    while i + 1 < args.len() {
        if args[i] == name {
            return args[i + 1].parse().unwrap_or(0);
        }
        i += 1;
    }
    0
}
fn main() {
    println!("{}", flag(&["--qty", "4", "--sku", "tea"], "--qty"));
}
```

### 没有这个标志

数组里只有 --sku。查找 --qty 走到末尾，返回 0。

```rust run expect="0" title="缺少数量"
fn flag(args: &[&str], name: &str) -> i32 {
    let mut i = 0;
    while i + 1 < args.len() {
        if args[i] == name {
            return args[i + 1].parse().unwrap_or(0);
        }
        i += 1;
    }
    0
}
fn main() {
    println!("{}", flag(&["--sku", "tea"], "--qty"));
}
```

### 两对标志

pairs 每看到一个以 -- 开头、后面还有值的格子就加一。--qty 4 和 --sku tea 是两对，打印 2。

```rust run expect="2" title="两对"
fn pairs(args: &[&str]) -> i32 {
    let mut i = 0;
    let mut n = 0;
    while i + 1 < args.len() {
        if args[i].starts_with("--") {
            n += 1;
            i += 2;
        } else {
            i += 1;
        }
    }
    n
}
fn main() {
    println!("{}", pairs(&["--qty", "4", "--sku", "tea"]));
}
```

### 解析失败变成 0

--qty 后面是 mug，不是整数。parse 失败时 unwrap_or 给出 0。

```rust run expect="0" title="不是整数"
fn flag(args: &[&str], name: &str) -> i32 {
    let mut i = 0;
    while i + 1 < args.len() {
        if args[i] == name {
            return args[i + 1].parse().unwrap_or(0);
        }
        i += 1;
    }
    0
}
fn main() {
    println!("{}", flag(&["--qty", "mug"], "--qty"));
}
```

sunface/rust-course 没有声明许可证，只作大纲参考，不搬句子：https://github.com/sunface/rust-course 。
