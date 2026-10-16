---
language: rust
chapter: 1
title: "Rust 环境搭建"
level: beginner
minutes: 8
goals:
  - "从侧栏选中 Rust"
  - "等工具链下完再运行"
  - "只编辑一个 main.rs"
sources:
  - runoob-rust
updated: "2026-10-16"
---
侧栏里的 Rust 第一次会下载编译器和解包后的标准库。进度条按解包字节走，大约一百五十二兆。

### 选中之后再运行

下载结束，工具栏的 Run 才会把当前编辑器里的源码送去编译。

```rust run expect="Night window open" title="窗口开了"
fn main() {
    println!("Night window open");
}
```
这一行说明工具链已经能编过 hello。

### 文件名固定

编辑器标签是 main.rs。不需要在本机安装 rustup。

```rust run expect="only this source" title="单文件"
fn main() {
    println!("only this source");
}
```
输出确认当前缓冲就是要编译的那一份。

### 版本提示

侧栏版本写着桌面实验。手机内存可能装不下这只编译器。

```rust run expect="desktop browser" title="桌面提示"
fn main() {
    println!("Open this in a desktop browser");
}
```
看到这句话，就表示这条环境说明对应的程序能跑。
