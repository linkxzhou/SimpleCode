---
language: rust
chapter: 35
title: "Rust 断言"
level: intermediate
minutes: 8
goals:
  - "在 main 里用 assert_eq 检查加法"
  - "连续检查两个等式"
  - "知道这里跑不了 cargo test"
sources:
  - rust-book
updated: "2026-10-20"
---

#[test] 要由 cargo test 启动。这里的编译器只编 main.rs 然后直接运行 main，测试函数不会被调用。assert_eq 仍然可以写在 main 里，失败会恐慌，成功就继续打印。

### 2 加 3 等于 5

assert_eq 两边都是 5 时什么都不打印。下一行再打印 ok，用来确认程序没有在断言处停住。

```rust run expect="ok" title="断言通过"
fn add(a: i32, b: i32) -> i32 {
    a + b
}
fn main() {
    assert_eq!(add(2, 3), 5);
    println!("ok");
}
```

### 再检查乘法

第一条断言看加法，第二条看 2 乘 4。都通过之后打印 pass。

```rust run expect="pass" title="两条断言"
fn main() {
    assert_eq!(2 + 3, 5);
    assert_eq!(2 * 4, 8);
    println!("pass");
}
```

### 不等就恐慌

如果把期望写成 0，assert_eq 会恐慌，后面的打印不会执行。可运行例子保持两边相等。下面只展示会失败的那一行，不执行。

```rust norun title="不要运行"
assert_eq!(2 + 2, 0);
```

### cargo test 不存在

没有 Cargo，也就没有测试套件。写成 #[test] 的函数即使能编译，这个运行方式也不会调用它。

```rust norun title="测试不会启动"
#[test]
fn add_works() {
    assert_eq!(2 + 2, 4);
}
```
