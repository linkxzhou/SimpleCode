---
language: rust
chapter: 34
title: "Rust 声明宏进阶"
level: advanced
minutes: 9
goals:
  - "为两个参数和三个参数各写一支"
  - "用重复把最后一个表达式留下来"
  - "知道过程宏需要单独的 crate"
sources:
  - rust-book
updated: "2026-10-20"
---

macro_rules 按模式选择一支，在编译期展开成普通代码。重复用 $($name:expr),+ 这种写法。过程宏是另一个 crate 里的函数，这里没有 cargo，所以只放阅读块。

### 三个数相加

两参数那一支这里用不到。三参数一支把 1、2、4 加起来，展开后就是普通加法，打印 7。

```rust run expect="7" title="展开加法"
macro_rules! addm {
    ($a:expr, $b:expr) => { $a + $b };
    ($a:expr, $b:expr, $c:expr) => { $a + $b + $c };
}
fn main() {
    println!("{}", addm!(1, 2, 4));
}
```

### 留下最后一个

只有一个表达式时直接用它。多个表达式时丢掉第一个，对剩余部分再展开。5、6、8 最后留下 8。

```rust run expect="8" title="最后一个"
macro_rules! lastm {
    ($x:expr) => { $x };
    ($x:expr, $($rest:expr),+) => { lastm!($($rest),+) };
}
fn main() {
    println!("{}", lastm!(5, 6, 8));
}
```

### 两个参数的那一支

练习只传入 2 和 5。匹配第一支，打印 7。宏在类型检查之前展开，所以写错表达式会像普通代码一样报错。

```rust run expect="7" title="两数相加"
macro_rules! addm {
    ($a:expr, $b:expr) => { $a + $b };
    ($a:expr, $b:expr, $c:expr) => { $a + $b + $c };
}
fn main() {
    println!("{}", addm!(2, 5));
}
```

### 过程宏加载不了

proc_macro 属性要在单独的 crate 里编译，再被别的 crate 引用。这个页面只有一个 main.rs，下面的属性不会运行。

```rust norun title="没有过程宏"
#[proc_macro]
pub fn nope(input: TokenStream) -> TokenStream {
    input
}
```
